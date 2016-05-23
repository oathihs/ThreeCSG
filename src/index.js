import { CSG } from '../lib/CSG'
import simplexFont from '../lib/FontSet'
/*
 adapted from THREE.CSG
 @author Chandler Prall <chandler.prall@gmail.com> http://chandler.prallfamily.com
 Wrapper for Evan Wallace's CSG library (https://github.com/evanw/csg.js/)
 Provides CSG capabilities for Three.js models.
 Provided under the MIT License
*/
export default (function () {
 var THREE
 // check dependency
 if (window.THREE) {
   THREE = window.THREE
 } else {
   window.throw("THREE is undefined, please include THREE.js")
 }

 THREE.CSG = CSG
 /**
  * Construct a CSG solid from a `THREE.Geometry` instance.
  *
  * @method fromGeometry
  * @return CSG instance
  */
 THREE.CSG.fromGeometry = function (geometry) {
   var polygons = []
   if (geometry instanceof THREE.BufferGeometry) {
    geometry = new THREE.Geometry().fromBufferGeometry(geometry)
   }
   for (var i = 0; i < geometry.faces.length; i++) {
     var face = geometry.faces[i]
     var pos
     var vertex
     var vertices = []
     var polygon

     if (face instanceof THREE.Face3) {
       vertex = geometry.vertices[face.a]
       pos = new CSG.Vector3D(vertex.x, vertex.y, vertex.z)
       vertices.push(new CSG.Vertex(pos))

       vertex = geometry.vertices[face.b]
       pos = new CSG.Vector3D(vertex.x, vertex.y, vertex.z)
       vertices.push(new CSG.Vertex(pos))

       vertex = geometry.vertices[face.c]
       pos = new CSG.Vector3D(vertex.x, vertex.y, vertex.z)
       vertices.push(new CSG.Vertex(pos))
     } else if (face instanceof THREE.Face4) {
       vertex = geometry.vertices[face.a]
       pos = new CSG.Vector3D(vertex.x, vertex.y, vertex.z)
       vertices.push(new CSG.Vertex(pos))

       vertex = geometry.vertices[face.b]
       pos = new CSG.Vector3D(vertex.x, vertex.y, vertex.z)
       vertices.push(new CSG.Vertex(pos))

       vertex = geometry.vertices[face.c]
       pos = new CSG.Vector3D(vertex.x, vertex.y, vertex.z)
       vertices.push(new CSG.Vertex(pos))

       vertex = geometry.vertices[face.d]
       pos = new CSG.Vector3D(vertex.x, vertex.y, vertex.z)
       vertices.push(new CSG.Vertex(pos))
     } else {
      throw 'Invalid face type at index ' + i
     }

     polygon = new CSG.Polygon(vertices)
     polygon.checkIfConvex() // throw a error if not convex
     polygons.push(polygon)
   }
   return CSG.fromPolygons(polygons)
 }

 /**
  * Construct a CSG solid from a `THREE.Mesh` instance.
  *
  * @method fromMesh
  * @return CSG instance
  */
 THREE.CSG.fromMesh = function (mesh) {
   mesh.updateMatrix()
   this.matrix = new CSG.Matrix4x4(mesh.matrix.clone().elements)
   var _geometry
   if (mesh.geometry instanceof THREE.BufferGeometry) {
    _geometry = new THREE.Geometry().fromBufferGeometry(mesh.geometry)
   } else {
    _geometry = mesh.geometry
   }
   var csg = THREE.CSG.fromGeometry(_geometry)
   return csg.transform(this.matrix)
 }

 THREE.CSG.fromText = function (text, parameters) {
   var polylines = vector_text(0, 0, text)
   var o = []
   var weight = parameters.weight || 3 // Weight of font. Default is 3
   var height = parameters.height || 5 // Thickness to extrude text. Default is 5
   var size = parameters.size || 20 // font size. Default is 20

   polylines.forEach(function (pl) {
     o.push(rectangular_extrude(pl, {w: weight, h: height}))
   })

   var csg = new CSG().union(o)
   csg = csg.scale(size / 20)
   return csg
 }

 THREE.CSG.resultFromCompactBinary = function (resultin) {
   function fromCompactBinary (r) {
     var result
     if (r.class === 'CSG') {
       result = CSG.fromCompactBinary(r)
     } else {
       throw new Error('Cannot parse result')
     }
     return result
   }
   var resultout
   if (resultin instanceof Array) {
     resultout = resultin.map(function (resultelement) {
       var r = resultelement
       r = fromCompactBinary(resultelement)
       return r
     })
   } else {
     resultout = fromCompactBinary(resultin)
   }
   return resultout
 }

 THREE.CSG.resultToCompactBinary = function (resultin) {
   var resultout
   if (resultin instanceof Array) {
     resultout = resultin.map(function (resultelement) {
       var r = resultelement
       r = resultelement.toCompactBinary()
       return r
     })
   } else {
     resultout = resultin.toCompactBinary()
   }
   return resultout
 }

 // convert CSG object to three.js geometry.
 THREE.CSG.toGeometry = function (csg) {
   var face
   var three_geometry = new THREE.Geometry()
   var polygons = csg.toPolygons()

   polygons.forEach(function (polygon) {
     var vertices = polygon.vertices.map(function (vertex) {
       return getGeometryVertex(three_geometry, vertex.pos)
     }, this)

     if (vertices[0] === vertices[vertices.length - 1]) {
       vertices.pop()
     }

     for (let i = 2; i < vertices.length; i++) {
       face = new THREE.Face3(vertices[0], vertices[i - 1], vertices[i], new THREE.Vector3().copy(polygon.plane.normal))
       three_geometry.faces.push(face)
     }
   }, this)

   return three_geometry
 }

 // convert CSG object to three.js mesh.
 THREE.CSG.toMesh = function (csg, material) {
   var three_geometry = THREE.CSG.toGeometry(csg)
   var three_mesh = new THREE.Mesh(three_geometry, material)
   return three_mesh
 }

 function getGeometryVertex (geometry, vertex_position) {
   geometry.vertices.push(new THREE.Vector3(vertex_position.x, vertex_position.y, vertex_position.z))
   return geometry.vertices.length - 1
 }

 function rectangular_extrude (pa, p) {
   var w = 1
   var h = 1
   var fn = 8
   var closed = false
   var round = true
   if (p) {
     if (p.w) w = p.w
     if (p.h) h = p.h
     if (p.fn) fn = p.fn
     if (p.closed !== undefined) closed = p.closed
     if (p.round !== undefined) round = p.round
   }
   return new CSG.Path2D(pa, closed).rectangularExtrude(w, h, fn, round)
 }

 function vector_char (x, y, c) {
   c = c.charCodeAt(0)
   c -= 32
   if (c < 0 || c >= 95) {
     return {
       width: 0,
       segments: []
     }
   }
   var off = c * 112
   var n = simplexFont[off++]
   var w = simplexFont[off++]
   var l = []
   var segs = []
   for (var i = 0; i < n; i++) {
     var xp = simplexFont[off + i * 2]
     var yp = simplexFont[off + i * 2 + 1]
     if (xp === -1 && yp === -1) {
       segs.push(l)
       l = []
     } else {
       l.push([xp + x, yp + y])
     }
   }
   if (l.length) segs.push(l)
   return {
     width: w,
     segments: segs
   }
 }

 function vector_text (x, y, s) {
   var o = []
   var x0 = x
   for (var i = 0; i < s.length; i++) {
     var c = s.charAt(i)
     if (c === '\n') {
       x = x0
       y -= 30
     } else {
       var d = vector_char(x, y, c)
       x += d.width
       o = o.concat(d.segments)
     }
   }
   return o
 }
})()
