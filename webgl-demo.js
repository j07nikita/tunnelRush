var hexRotate = 5.0;
var tubespeed = 0;
var dir = 0, len = 0, left = 0;
var press = 0, n1 = 0;
var obstacle = 0, deltaTime = 0, timer = 0, n = 0, count = 0, myAngle = 0, myAngle1 = 0, move = 1;
main();
// var timeElement = document.getElementById("length");
// var timenode = document.createTextNode("");
// timeElement.appendChild(timenode);
window.onkeydown = function(e) {
  var code = e.keyCode ? e.keyCode : e.which;
  if(code == 37) {//left
    dir -= 1;
    left -= 1;
    dir = dir % 16;
    left = left % 16;  
    press = 1
    myAngle  -= 1;
  } else if(code == 39) {//right
    dir += 1;
    left += 1;
    dir = dir % 16;
    left = left % 16;
    press = 1
    myAngle += 1;
    left = 0;
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
  var lengthElement = document.getElementById("length");
  var lengthNode = document.createTextNode("");
  lengthElement.appendChild(lengthNode);
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
    deltaTime = now - then;
    then = now;
    timer += 1;
    if(timer > 4000) {
      timer = 0;
    }
    len = len + 1;
    lengthNode.nodeValue = len; 
    drawScene(gl, programInfo, buffers, deltaTime);
    
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

}


function initBuffers(gl) {

  //tunnel
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
    positions[k++] = x * Math.cos(theta * Math.PI/180) + y * Math.sin(theta * Math.PI/180);
    positions[k++] = y * Math.cos(theta * Math.PI/180) - x * Math.sin(theta * Math.PI/180);
    positions[k++] = 0;
    positions[k++] = x * Math.cos(theta * Math.PI/180) + y * Math.sin(theta * Math.PI/180);
    positions[k++] = y * Math.cos(theta * Math.PI/180) - x * Math.sin(theta * Math.PI/180);
    positions[k++] = -4;
    var temp1 = x;
    var temp2 = y;
    x = temp1 * Math.cos(theta * Math.PI/180) + temp2 * Math.sin(theta * Math.PI/180);
    y = temp2 * Math.cos(theta * Math.PI/180) - temp1 * Math.sin(theta * Math.PI/180);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);  
  const faceColors = [
    [0.5, 0.5, 0.5, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 1],
    [1, 1, 0, 1],
    [1, 0, 1, 1],
    [0, 1, 1, 1],
    [0, 0.5, 0, 1],
    [1, 0.5, 0, 1],
  ]; 
  const faceColors2 = [
    [0, 0, 0, 1],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ] 
  var colors = [];
  var colors2 = [];
  for(var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    const p = faceColors2[j];
    colors = colors.concat(c, c, c, c);
    colors2 = colors2.concat(p, p, p, p);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const colorBuffer2 = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors2), gl.STATIC_DRAW);


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
  

  //obstacle---------------------------------------------------------------------------------
  const opositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, opositionBuffer);
  opositions = [];
  var theta = 45;
  var x = 0, y = 2, k = 0;
  for(var i = 0; i < 4; i++) {
    opositions[k++] = 0;
    opositions[k++] = 0;
    opositions[k++] = 0;
    opositions[k++] = x;
    opositions[k++] = y;
    opositions[k++] = 0;
    opositions[k++] = x * Math.cos(theta * Math.PI/180) + y * Math.sin(theta * Math.PI/180);
    opositions[k++] = y * Math.cos(theta * Math.PI/180) - x * Math.sin(theta * Math.PI/180);
    opositions[k++] = 0;
    var temp1 = x, temp2 = y;
    x = temp1 * Math.cos(theta * Math.PI/180) + temp2 * Math.sin(theta * Math.PI/180);
    y = temp2 * Math.cos(theta * Math.PI/180) - temp1 * Math.sin(theta * Math.PI/180);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(opositions), gl.STATIC_DRAW);

  const ofaceColors = [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ];
  ocolors = [];
  for(var j = 0; j < ofaceColors.length; j++) {
    const c = ofaceColors[j];
    ocolors = ocolors.concat(c, c, c);
  }
  const ocolorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, ocolorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ocolors), gl.STATIC_DRAW); 

  const oindexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, oindexBuffer);
  const oindices = [
    0, 1, 2,
    3, 4, 5,
    6, 7, 8,
    9, 10, 11,
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(oindices), gl.STATIC_DRAW);

  //box ---------------------------------------------------------------------------------------------------------
  boxPosition = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxPosition);
  box = [
    0.035, 0.035, 0,
    -0.035, 0.035, 0,
    0.035, -0.035, 0,
    -0.035, -0.035, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(box), gl.STATIC_DRAW);

  const scolors = [
    1, 1, 1, 1,
    1, 1, 1, 1,
    1, 1, 1, 1,
    1, 1, 1, 1,
  ];
  
  const scolorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, scolorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(scolors), gl.STATIC_DRAW);

  //triangle-----------------------------------------------------------------------------------------------------
  trianglePosition = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosition);
  triangle = [
    0, 0, 0,
    0, -2, 0,
    1.414213562373095, -1.4142135623730951, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle), gl.STATIC_DRAW);

  const Tcolors = [
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
  ];

  const TcolorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, TcolorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Tcolors), gl.STATIC_DRAW);



  return {
    position: positionBuffer,
    indices: indexBuffer,
    color: colorBuffer,
    boxes: boxPosition,
    triangles: trianglePosition,
    oposition: opositionBuffer,
    oindices: oindexBuffer,
    ocolor: ocolorBuffer,
    tcolor: TcolorBuffer,
    color2: colorBuffer2,
    color3: scolorBuffer,
  };
}


function drawScene(gl, programInfo, buffers, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 30 * Math.PI / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 1;
  const zFar = 80.0;
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
 
  //tunnel-------------------------------------------------------------------------------------------------
  for(var i = 0; i < 100; i++) {
    const modelViewMatrix = mat4.create();
    if(tubespeed > 110) {
      tubespeed = 0;
    } 
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -1.8 - 4 * i + tubespeed]);
    
    var factor;
    if(i % 2 == 0) {
      factor = 2 * i;
    } else {
      factor = 3 * i;
    }

    mat4.rotate(modelViewMatrix, modelViewMatrix, 45/2 * Math.PI/180, [0, 0, 1]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, 45 * Math.PI/180 * factor, [0, 0, 1]);
    if(press) {
      mat4.rotate(modelViewMatrix, modelViewMatrix, 45/2 * Math.PI/180 * dir, [0, 0, 1]);
    }

    {
      const numComponents = 3; const type = gl.FLOAT; const normalize = false; const stride = 0; const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }
    if(timer > 900 && timer < 2000) {
      {
        const numComponents = 4; const type = gl.FLOAT; const normalize = false; const stride = 0; const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color2);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
      }      
    } else {
      {
        const numComponents = 4; const type = gl.FLOAT; const normalize = false; const stride = 0; const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
      }
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);  
    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
    
    {
      const offset = 0; const vertexCount = 48; const type = gl.UNSIGNED_SHORT;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    tubespeed += deltaTime / 3;
  }

  //obstacle-----------------------------------------------------------------------------------------------------------------
  if(count > 0.5  ) {
    for(var i = 0; i < 1; i++) {
      if(tubespeed >= 109) {
        count = Math.random();        
      }
      if((myAngle1 >= 0 && myAngle1 <= 8) || myAngle1 == 14 || myAngle1 == 15) {
        if(tubespeed - 50 > -1 && tubespeed - 50 < 0) {
          alert("GameOver");
          location.reload();
        }
      }    
      myAngle1 = 2 + dir;  
      const modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -50 + tubespeed]); 
      mat4.rotate(modelViewMatrix, modelViewMatrix, 45/2 * Math.PI/180, [0, 0, -50]);
      mat4.rotate(modelViewMatrix, modelViewMatrix, 45 * Math.PI/180, [0, 0, -50]);
      if(press) {
        mat4.rotate(modelViewMatrix, modelViewMatrix, 45/2 * Math.PI/180 * dir, [0, 0, -50]);
      }
      {
        const numComponents = 3; const type = gl.FLOAT; const normalize = false; const stride = 0; const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.oposition);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
      }
      {
        const numComponents = 4; const type = gl.FLOAT; const normalize = false; const stride = 0; const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.ocolor);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
      }
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.oindices);
      gl.useProgram(programInfo.program);
      gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
      gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
      {
        const vertexCount = 12; const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      }
    }  
  }  

  // // triangle----------------------------------------------------------------------------------------------------------------
  if(count <= 0.5) {
    for(var i = 0; i < 2; i++) {
      if(tubespeed >= 109) {
        n = Math.floor(Math.random() * 7);
        count = Math.random();
        if(i == 1) {
          myAngle = 2 * n + dir;
        }
      }
      if(i == 1 && (myAngle == 0 || myAngle == 1 || myAngle == 7 || myAngle == 8 || myAngle == 9 || myAngle == 15 || myAngle == -1 || myAngle == -7 || myAngle == -8 || myAngle == -9 || myAngle == -15)) {
        if(i == 1 && tubespeed - 50 > -1 && tubespeed - 50 < 0) {
          alert("GameOver");
          location.reload();
        }
      }
      const modelViewMatrix = mat4.create();
      mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -50 + tubespeed]); 
      mat4.rotate(modelViewMatrix, modelViewMatrix, 45/2 * Math.PI/180, [0, 0, -50]);
      mat4.rotate(modelViewMatrix, modelViewMatrix, 45 * n * Math.PI/180, [0, 0, -50]);
      if(len > 1000)
        mat4.rotate(modelViewMatrix, modelViewMatrix, 45 * move * Math.PI/180, [0, 0, -50]);
      if(i == 1) {
       mat4.rotate(modelViewMatrix, modelViewMatrix, 180 * Math.PI/180, [0, 0, -50]); 
      }
      if(len < 1000 && press) {
        mat4.rotate(modelViewMatrix, modelViewMatrix, 45/2 * Math.PI/180 * dir, [0, 0, -50]);
      }
      {
        const numComponents = 3; const type = gl.FLOAT; const normalize = false; const stride = 0; const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.triangles);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
      }
      {
        const numComponents = 4; const type = gl.FLOAT; const normalize = false; const stride = 0; const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.tcolor);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
      }

      gl.useProgram(programInfo.program);
      gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
      gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
      {
        const offset = 0; const vertexCount = 3;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
      }
      move += deltaTime;
    }
  }
  //               temp box                             //
  for(var i = 0 ; i < 1; i++) {
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 1, -1]);
    {
      const numComponents = 3; const type = gl.FLOAT; const normalize = false; const stride = 0; const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.boxes);
      gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }
    {
      const numComponents = 4; const type = gl.FLOAT; const normalize = false; const stride = 0; const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color3);
      gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }    
    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
    
    {
      const offset = 0; const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
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

// function detectCollision() {
// }
