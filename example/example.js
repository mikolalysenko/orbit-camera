"use strict"

var shell = require("gl-now")()
var createMesh = require("gl-mesh")
var glm = require("gl-matrix")
var mat4 = glm.mat4
var simple3DShader = require("simple-3d-shader")
var createOrbitCamera = require("../orbit.js")

var camera = createOrbitCamera([0, 10, 20],
                               [0, 3, 0],
                               [0, 1, 0])

var shader, mesh

shell.on("gl-init", function() {
  shader = simple3DShader(shell.gl)
  mesh = createMesh(shell.gl, require("bunny"))
})

shell.on("gl-render", function(t) {
  //Bind shader
  shader.bind()

  //Set camera parameters
  var scratch = mat4.create()
  shader.uniforms.model = scratch
  shader.uniforms.projection = mat4.perspective(scratch, Math.PI/4.0, shell.width/shell.height, 0.1, 1000.0)
  shader.uniforms.view = camera.view(scratch)
  
  //Draw object
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
    camera.pan([(shell.mouseX - shell.prevMouseX)/shell.width,
                (shell.mouseY - shell.prevMouseY)/shell.height])
  }
  if(shell.scroll[1]) {
    camera.zoom(shell.scroll[1] * 0.1)
  }
})
