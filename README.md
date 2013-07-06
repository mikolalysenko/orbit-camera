orbit-camera
============
Simple arcball camera built on top of gl-matrix

## Example

```javascript
var shell = require("gl-now")()
var createMesh = require("gl-mesh")
var glm = require("gl-matrix")
var mat4 = glm.mat4
var simple3DShader = require("simple-3d-shader")
var createOrbitCamera = require("orbit-camera")

var camera = createOrbitCamera([0, 10, 20],
                               [0, 3, 0],
                               [0, 1, 0])

var shader, mesh

shell.on("gl-init", function() {
  shader = simple3DShader(shell.gl)
  mesh = createMesh(shell.gl, require("bunny"))
})

shell.on("gl-render", function(t) {
  shader.bind()

  var scratch = mat4.create()
  shader.uniforms.model = scratch
  shader.uniforms.projection = mat4.perspective(scratch, Math.PI/4.0, shell.width/shell.height, 0.1, 1000.0)
  shader.uniforms.view = camera.view(scratch)
  
  mesh.bind(shader)
  mesh.draw()
  mesh.unbind()
})

shell.on("tick", function() {
  if(shell.wasDown("mouse-left")) {
    camera.rotate([shell.mouseX/shell.width-0.5, shell.mouseY/shell.height-0.5],
                  [shell.prevMouseX/shell.width-0.5, shell.prevMouseY/shell.height-0.5])
  }
  if(shell.wasDown("mouse-right")) {
    camera.pan([10*(shell.mouseX-shell.prevMouseX)/shell.width,
                10*(shell.mouseY - shell.prevMouseY)/shell.height])
  }
  if(shell.scroll[1]) {
    camera.zoom(shell.scroll[1] * 0.1)
  }
})
```

## Install

    npm install orbit-camera
    
## API

```javascript
var createOrbitCamera = require("orbit-camera")
```

### `var camera = createOrbitCamera(eye, center, up)`
Creates an orbit camera looking at `center`.  This has the same semantics as `gluLookAt`

* `eye` is the eye vector of the camera
* `center` is the target the camera is looking at
* `up` is the up direction for the camera

**Returns** A new orbit camera object

### `camera.lookAt(eye, center, up)`
Move the camera to look at the new position.

### `camera.pan(translation)`
Moves the center of the camera by `translation`.  Note that translation must be an array of length either 2 or 3

### `camera.rotate(cur, prev)`
Applies a rotation to the camera.  `cur` and `prev` are the state of the previous locations.  These can be pairs of 2D arrays representing the mouse coordinates in distance relative to the center of the sceen.

### `camera.zoom(delta)`
Zooms in or out by some amount

### `camera.view([out])`
Returns the current view matrix associated to the camera

## Credits
(c) 2013 Mikola Lysenko. MIT License
