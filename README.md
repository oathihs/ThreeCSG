# THREE.CSG
> A [THREE.js](http://threejs.org/) plugin to allow implementing boolean operations on THREE Objects(Mesh, Geometry). The boolean operations are supported by [csg.js](http://threejs.org/). For an overview of the CSG process, see the orginal [csg.js](https://evanw.github.io/csg.js/) code.

## Include in Your HTML
``` bash
<script src="build/THREE.CSG.js"></script>
```

## Convert between THREE object and CSG object
``` bash
# convert THREE.Geometry to CSG format
THREE.CSG.fromGeometry(geometry)

# convert THREE.Mesh to CSG format
THREE.CSG.fromMesh(mesh)

# convert to THREE.Geometry
THREE.CSG.toGeometry(csg)
```

## Boolean Operations
``` bash
# Union
var result = A.union(B)

# Subtract
var result = A.subtract(B)

# Intersect
var result = A.intersect(B)
```