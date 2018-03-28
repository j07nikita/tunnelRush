var hexRotate = 30.0;
main();

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  var then = 0;
  function render(now) {
    now *= 0.001;
    const deltaTime = now - then;
    then = now;
    drawScene(gl, programInfo, buffers, deltaTime);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  // Draw the scene
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//
function initBuffers(gl) {

  // Create a buffer for the square's positions.

  const positionBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // Now create an array of positions for the square.

  positions = [];
  var theta = 60;
  var x = 0;
  var y = 1;
  var k = 0;
  positions[k++] = 0;
  positions[k++] = 0;
  positions[k++] = 0;
  positions[k++] = x;
  positions[k++] = y;
  positions[k++] = 0;
  for(i = 0; i < 5; i++) {
    positions[k++] = x * Math.cos(theta * Math.PI/180) - y * Math.sin(theta * Math.PI/180);
    positions[k++] = y * Math.cos(theta * Math.PI/180) + x * Math.sin(theta * Math.PI/180);
    positions[k++] = 0;
    var temp1 = x;
    var temp2 = y;
    x = temp1 * Math.cos(theta * Math.PI/180) - temp2 * Math.sin(theta * Math.PI/180);
    y = temp2 * Math.cos(theta * Math.PI/180) + temp1 * Math.sin(theta * Math.PI/180);
  }
  x = 0;
  y = 1;
  positions[k++] = 0;
  positions[k++] = 0;
  positions[k++] = -1;
  positions[k++] = x;
  positions[k++] = y;
  positions[k++] = -1;
  for(i = 0; i < 5; i++) {
    positions[k++] = x * Math.cos(theta * Math.PI/180) - y * Math.sin(theta * Math.PI/180);
    positions[k++] = y * Math.cos(theta * Math.PI/180) + x * Math.sin(theta * Math.PI/180);
    positions[k++] = -1;
    var temp1 = x;
    var temp2 = y;
    x = temp1 * Math.cos(theta * Math.PI/180) - temp2 * Math.sin(theta * Math.PI/180);
    y = temp2 * Math.cos(theta * Math.PI/180) + temp1 * Math.sin(theta * Math.PI/180);
  }

  const indices = [
    0, 1, 2,
    0, 2, 3,
    0, 3, 4,
    0, 4, 5,
    0, 5, 6,
    0, 6, 1,
    7, 8, 9,
    7, 9, 10,
    7, 10, 11,
    7, 11, 12,
    7, 12, 13,
    7, 13, 8,
    1, 2, 8,
    8, 9, 2,
    2, 3, 9,
    9, 10, 3,
    3, 4, 10,
    10, 11, 4,
    4, 5, 11,
    11, 12, 5,
    5, 6, 12,
    12, 13, 6,
    6, 1, 13,
    13, 8, 1, 
  ];

  const faceColors = [
    [1.0,  1.0,  1.0,  1.0],
    [1.0,  0.0,  0.0,  1.0],
    [0.0,  1.0,  0.0,  1.0],
    [1.0,  1.0,  0.0,  0.0],
    [0.0,  0.0,  1.0,  0.0],
    [0.0,  1.0,  1.0,  0.0], 
    [0.0,  1.0,  1.0,  0.0],
    [0.0,  1.0,  1.0,  0.0],
    [0.0,  1.0,  1.0,  0.0],
    [0.0,  1.0,  1.0,  0.0],
    [0.0,  1.0,  1.0,  0.0],
    [0.0,  1.0,  1.0,  0.0],
    [0.0,  1.0,  1.0,  0.0],
    [0.0,  1.0,  1.0,  0.0],
  ];

  var colors = [];
  for(var j = 0; j < faceColors.length; ++j) {
      const c = faceColors[j];
      colors = colors.concat(c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float64Array(colors), gl.STATIC_DRAW);
  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  return {
    position: positionBuffer,
    indices: indexBuffer,
    color: colorBuffer,
  };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 30 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0;
  const zFar = 5.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -6.0]);  // amount to translate

  mat4.rotate(modelViewMatrix, modelViewMatrix, hexRotate, [0, 0, 1]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, hexRotate * .7, [1, 0, 0]);
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type, 
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
}

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);  

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 2 * 36;
    const type = gl.UNSIGNED_SHORT;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // hexRotate += deltaTime;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
