# THREE.CSG
> A [THREE.js](http://threejs.org/) plugin to allow implementing boolean operations on THREE Objects(Mesh, Geometry). The boolean operations are supported by [csg.js](http://threejs.org/). For an overview of the CSG process, see the orginal [csg.js](https://evanw.github.io/csg.js/) code.

## Include in Your HTML
Remember to include THREE.js before including this plugin.
``` bash
<script src="build/THREE.CSG.js"></script>
```


## Usage

### Convert between THREE object and CSG object
``` bash
# convert THREE.Geometry to CSG format
var csg = THREE.CSG.fromGeometry(geometry)

# convert THREE.Mesh to CSG format
var csg = THREE.CSG.fromMesh(mesh)

# convert to THREE.Geometry
var geometry = THREE.CSG.toGeometry(csg)

# convert to THREE.Mesh
var mesh = THREE.CSG.toMesh(csg, material)
```

### Boolean Operations
``` bash
# Union
var result = A.union(B)

# Subtract
var result = A.subtract(B)

# Intersect
var result = A.intersect(B)
```

## Live Demo
[live Demo](http://stannnn.github.io/ThreeCSG/)

## Development
``` bash
# install dependencies
npm install

# build for production
npm run build
```