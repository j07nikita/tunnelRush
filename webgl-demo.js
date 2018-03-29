var hexRotate = 5.0;
var tubespeed = 0;
var dir = 0;
var press = 0;
main();

window.onkeydown = function(e) {
  var code = e.keyCode ? e.keyCode : e.which;
  if(code == 37) {//left
    dir -= -1;  
    press = 1
  } else if(code == 39) {//right
    dir += 1;
    press = 1
  } else {
    press = 0;
  } 
}

function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

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

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

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

}


function initBuffers(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  positions = [];
  var theta = 45;
  var x = 0;
  var y = 2;
  var k = 0;
  for(var i = 0; i < 8; i++) {
    positions[k++] = x;
    positions[k++] = y;
    positions[k++] = 0;
    positions[k++] = x;
    positions[k++] = y;
    positions[k++] = -4; 
    positions[k++] = x * Math.cos(theta * Math.PI/180) - y * Math.sin(theta * Math.PI/180);
    positions[k++] = y * Math.cos(theta * Math.PI/180) + x * Math.sin(theta * Math.PI/180);
    positions[k++] = 0;
    positions[k++] = x * Math.cos(theta * Math.PI/180) - y * Math.sin(theta * Math.PI/180);
    positions[k++] = y * Math.cos(theta * Math.PI/180) + x * Math.sin(theta * Math.PI/180);
    positions[k++] = -4;
    var temp1 = x;
    var temp2 = y;
    x = temp1 * Math.cos(theta * Math.PI/180) - temp2 * Math.sin(theta * Math.PI/180);
    y = temp2 * Math.cos(theta * Math.PI/180) + temp1 * Math.sin(theta * Math.PI/180);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);  
  const faceColors = [
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 1],
    [1, 1, 0, 1],
    [1, 0, 1, 1],
    [0, 1, 1, 1],
    [0, 0.5, 0, 1],
    [1, 0.5, 0, 1],
  ];  
  var colors = [];
  for(var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];

    colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  const indices = [
    0, 1, 2,
    1, 2, 3,
    4, 5, 6,
    5, 6, 7,
    8, 9, 10,
    9, 10, 11,
    12, 13, 14,
    13, 14, 15,
    16, 17, 18,
    17, 18, 19,
    20, 21, 22,
    21, 22, 23,
    24, 25, 26,
    25, 26, 27,
    28, 29, 30,
    29, 30, 31,
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  boxPosition = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxPosition);
  box = [
    0.035, 0.035, 0,
    -0.035, 0.035, 0,
    0.035, -0.035, 0,
    -0.035, -0.035, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(box), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    indices: indexBuffer,
    color: colorBuffer,
    boxes: boxPosition,
  };
}

function drawScene(gl, programInfo, buffers, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);
 
  for(var i = 0; i < 60; i++) {
    const modelViewMatrix = mat4.create();

    if(tubespeed > 30) {
      tubespeed = 0;
    }  
    mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   [0, 1, -1.8 - 4 * i + tubespeed]);  // amount to translate

    // mat4.rotate(modelViewMatrix, modelViewMatrix, hexRotate * 0.05, [0, 1, 0]);
    // mat4.rotate(modelViewMatrix, modelViewMatrix, hexRotate * 0.09, [1, 0, 0]);
    var factor;
    if(i % 2 == 0) {
      factor = 2 * i;
    } else {
      factor = 3 * i;
    }
    mat4.rotate(modelViewMatrix, modelViewMatrix, 20 * Math.PI/180, [0, 0, 1]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, 45 * Math.PI/180 * factor, [0, 0, 1]);
    if(press) {
      mat4.rotate(modelViewMatrix, modelViewMatrix, 22.5 * Math.PI/180 * dir, [0, 0, 1]);
    }
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
    gl.useProgram(programInfo.program);
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
      const vertexCount = 48;
      const type = gl.UNSIGNED_SHORT;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    tubespeed += deltaTime / 10;
  }
  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -1]);
  {
    const numComponents = 3;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next
                              // 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.boxes);
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
  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    projectionMatrix);

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix);
  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);

  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
