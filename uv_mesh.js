
const VERTEX_STRIDE = 32;

class Mesh {
    /** 
     * Creates a new mesh and loads it into video memory.
     * 
     * @param {WebGLRenderingContext} gl  
     * @param {number} program
     * @param {number[]} vertices
     * @param {number[]} indices
    */
    constructor(gl, program, vertices, indices, material) {
        this.verts = create_and_load_vertex_buffer(gl, vertices, gl.STATIC_DRAW);
        this.indis = create_and_load_elements_buffer(gl, indices, gl.STATIC_DRAW);

        this.n_verts = vertices.length;
        this.n_indis = indices.length;
        this.program = program;
        this.material = material;
    }
    set_vertex_attributes() {
        set_vertex_attrib_to_buffer(
            gl, this.program,
            "coordinates",
            this.verts, 3,
            gl.FLOAT, false, VERTEX_STRIDE, 0
        );

        /*set_vertex_attrib_to_buffer( 
            gl, this.program, 
            "color", 
            this.verts, 4, 
            gl.FLOAT, false, VERTEX_STRIDE, 12
        );*/

        set_vertex_attrib_to_buffer(
            gl, this.program,
            "uv",
            this.verts, 2,
            gl.FLOAT, false, VERTEX_STRIDE, 12
        );
        set_vertex_attrib_to_buffer(
            gl, this.program,
            "normal",
            this.verts, 3,
            gl.FLOAT, false, VERTEX_STRIDE, 20
        );
    }

    /**
     * Create a box mesh but using UV coordinates that support 6-sided texture mapping. 
     * @param {WebGLRenderingContext} gl 
     * @param {number} width 
     * @param {number} height 
     * @param {number} depth 
     */

    static box_quads(gl, program, width, height, depth, material) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts = [
            //top
            hwidth, hheight, -hdepth,       /*0.5, 0.5, 0.5, 1.0,*/     1.0, 1.0,
            hwidth, hheight, hdepth,        /*0.5, 0.5, 0.5, 1.0,*/     0.0, 1.0,
            -hwidth, hheight, hdepth,       /*0.5, 0.5, 0.5, 1.0,*/     0.0, 0.0,
            -hwidth, hheight, -hdepth,       /*0.5, 0.5, 0.5, 1.0,*/    1.0, 0.0,
            //left
            -hwidth, hheight, -hdepth,      /*0.5, 0.5, 0.5, 1.0,*/     0.0, 0.0,
            -hwidth, hheight, hdepth,       /*0.5, 0.5, 0.5, 1.0,*/     1.0, 0.0,
            -hwidth, -hheight, hdepth,      /*0.5, 0.5, 0.5, 1.0,*/     1.0, 1.0,
            -hwidth, -hheight, -hdepth,     /*0.5, 0.5, 0.5, 1.0,*/     0.0, 1.0,
            //front
            hwidth, -hheight, -hdepth,      /*0.5, 0.5, 0.5, 1.0,*/     1.0, 1.0,
            hwidth, hheight, -hdepth,       /*0.5, 0.5, 0.5, 1.0,*/     1.0, 0.0,
            -hwidth, hheight, -hdepth,      /*0.5, 0.5, 0.5, 1.0,*/     0.0, 0.0,
            -hwidth, -hheight, -hdepth,     /*0.5, 0.5, 0.5, 1.0,*/     0.0, 1.0,
            //right
            hwidth, -hheight, hdepth,       /*0.5, 0.5, 0.5, 1.0,*/     1.0, 1.0,
            hwidth, hheight, hdepth,        /*0.5, 0.5, 0.5, 1.0,*/     1.0, 0.0,
            hwidth, hheight, -hdepth,       /*0.5, 0.5, 0.5, 1.0,*/     0.0, 0.0,
            hwidth, -hheight, -hdepth,      /*0.5, 0.5, 0.5, 1.0,*/     0.0, 1.0,
            //bottom
            hwidth, -hheight, -hdepth,      /*0.5, 0.5, 0.5, 1.0,*/     1.0, 1.0,
            hwidth, -hheight, hdepth,       /*0.5, 0.5, 0.5, 1.0,*/     0.0, 1.0,
            -hwidth, -hheight, hdepth,      /*0.5, 0.5, 0.5, 1.0,*/     0.0, 0.0,
            -hwidth, -hheight, -hdepth,     /*0.5, 0.5, 0.5, 1.0,*/     1.0, 0.0,
            //back
            hwidth, -hheight, hdepth,      /*0.5, 0.5, 0.5, 1.0,*/     0.0, 1.0,
            hwidth, hheight, hdepth,       /*0.5, 0.5, 0.5, 1.0,*/     0.0, 0.0,
            -hwidth, hheight, hdepth,      /*0.5, 0.5, 0.5, 1.0,*/     1.0, 0.0,
            -hwidth, -hheight, hdepth,     /*0.5, 0.5, 0.5, 1.0,*/     1.0, 1.0

        ];

        let indis = [
            // counter-clockwise winding
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            17, 16, 18, 16, 19, 18,
            20, 22, 21, 22, 20, 23
        ];

        return new Mesh(gl, program, verts, indis, material);
    }

    static sphere(gl, program, subdivs, material) { //looked at reference on slides: https://www.danielsieger.com/blog/2021/03/27/generating-spheres.html as well as http://www.songho.ca/opengl/gl_sphere.html
        //let topVert = [0,1,0];
        //let indexNum = 0;
        //verts.push(topVert, 1, 1, 1, 1, 0,0.5, 0,1,0); //verts, colors, uv, normal
        //indexNum++;
        //let botVert = [0,-1,0];
        //verts.push(botVert, 1, 1, 1, 1, 1, 0.5,0,-1,0);
        /*for (let i = 0; i < subdivs; ++i){ //handles top and bottom rings of sphere
            let i1 = i + 1;
            let i2 = (i + 1) % subdivs + 1;
            indis.push(0, i1, i2);
            i1 = i + subdivs * (subdivs-2) + 1;
            i2 = (i + 1) % subdivs + subdivs * (subdivs-2) + 1;
            indis.push(indexNum, i1, i2);
        }*/
        let verts = [];
        let indis = [];
        const tau = Math.PI * 2;
        const len = 2;

        for (let layer = 0; layer <= subdivs; layer++) {
            let y_turns = layer / subdivs / 2;
            let y = Math.cos(y_turns * tau) / 2;
            let theta = Math.sin(y_turns * tau) / 2;
            for (let subdiv = 0; subdiv <= subdivs + 1; subdiv++) {
                let turns = subdiv / subdivs;
                let rads = turns * tau;
                let x = Math.cos(rads) * theta;
                let z = Math.sin(rads) * theta;
                verts.push(x, y, z);
                let u = subdiv / subdivs;
                let v = layer / subdivs;
                verts.push(u, v);
                let norm_x = x / len;
                let norm_y = y / len;
                let norm_z = z / len;
                verts.push(norm_x, norm_y, norm_z);
            }
        }

        for (let n = 0; n < subdivs; n++) {
            let i1 = n * (subdivs + 2); //current stack start
            let i2 = i1 + subdivs + 2; //next stack start
            for (let j = 0; j < subdivs + 1; j++, i1++, i2++) {
                if (n != 0) {
                    indis.push(i2, i1 + 1, i1);
                }
                if (n != (subdivs - 1)) {
                    indis.push(i2, i2 + 1, i1 + 1);
                }
            }
        }
        //console.log(indis);
        //let botVert = [0,-1,0] //need to add indis too

        return new Mesh(gl, program, verts, indis, material);

    }



    /**
     * Render the mesh. Does NOT preserve array/index buffer or program bindings! 
     * 
     * @param {WebGLRenderingContext} gl 
     */
    render(gl) {
        // const old_prog = gl.getParameter( gl.CURRENT_PROGRAM );
        gl.useProgram(this.program);
        gl.cullFace(gl.BACK);
        gl.enable(gl.CULL_FACE);
        this.set_vertex_attributes();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verts);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indis);
        bind_texture_samplers(gl, this.program, "tex_0");

        gl.activeTexture(gl.TEXTURE0);
        this.material.bind(gl);

        gl.drawElements(gl.TRIANGLES, this.n_indis, gl.UNSIGNED_SHORT, 0);
        gl.useProgram(null);
    }

    /**
     * Parse the given text as the body of an obj file.
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram} program
     * @param {string} text
     */
    static from_obj_text(gl, program, text, material) { //used https://github.com/chinedufn/wavefront-obj-parser/ in order to implement wavefront indices
        // create verts and indis from the text 

        let verts = [];
        let vertNorms = [];
        let vertUVs = [];
        let indis = [];
        let finalVerts = [];
        let faceNum = {
            val: 2
        }
        let lines = text.split(/\r?\n/);
        lines.forEach(line => Mesh.parse_line(line, verts, indis, vertUVs, vertNorms, finalVerts, faceNum));
        //console.log(finalVerts);
        //console.log(indis);
        //exit(1);
        //indis.pop();
        return new Mesh(gl, program, finalVerts, indis, material);
    }

    static parse_line(line, verts, indis, vertUVs, vertNorms, finalVerts, faceNum) {
        line = line.trim();
        //ask about checking first element for comment before trimming
        line = line.split(/(\s+)/);
        if (line[0] === 'v') {
            let parts_of_line = line; //.split(/(\s+)/);
            //console.log(parts_of_line);
            for (let i = 2; i < 7; i = i + 2) {
                if (i == 2) {
                    verts.push(parseFloat(parts_of_line[i]));
                }
                else {
                    verts.push(parseFloat(parts_of_line[i]));
                }
            }
            /*for(let j = 0; j < 3; j++){
                verts.push(0.5);
            }
            
            verts.push(1.0);*/
        }
        else if (line[0] === 'f') {

            let parts_of_line = line; //.split(/(\s+)/);
            //console.log(parts_of_line);
            for (let i = 2; i < 7; i = i + 2) {
                let faces = parts_of_line[i].split('/')
                let faceIndex = parseInt(faces[0]);
                let vertIndex = (faceIndex - 1) * 3;
                let UVIndex = (parseInt(faces[1]) - 1) * 2;
                let normIndex = (parseInt(faces[2] - 1)) * 3;
                finalVerts.push(-verts[vertIndex], verts[vertIndex + 1], verts[vertIndex + 2], vertUVs[UVIndex], 1 - vertUVs[UVIndex + 1], -vertNorms[normIndex], vertNorms[normIndex + 1], vertNorms[normIndex + 2]);

            }
            indis.push(faceNum.val, faceNum.val - 2, faceNum.val - 1);
            faceNum.val += 3;
        }
        else if (line[0] === "vt") { //vertex UVs
            //line = line.trim();
            let parts_of_line = line; //.split(/(\s+)/);
            for (let i = 2; i < 5; i = i + 2) {
                vertUVs.push(parseFloat(parts_of_line[i]));
            }
        }
        else if (line[0] === "vn") { //vertex normals
            let parts_of_line = line; //.split(/(\s+)/);
            for (let i = 2; i < 7; i = i + 2) {
                vertNorms.push(parseFloat(parts_of_line[i]));
            }
        }
    }

    /**
     * Asynchronously load the obj file as a mesh.
     * @param {WebGLRenderingContext} gl
     * @param {string} file_name 
     * @param {WebGLProgram} program
     * @param {function} f the function to call and give mesh to when finished.
     */
    static from_obj_file(gl, file_name, program, f, material) { //f is callback for when its done loading mesh, f should be setting mesh variable to non null need to write the function
        let request = new XMLHttpRequest();

        // the function that will be called when the file is being loaded
        request.onreadystatechange = function () {
            // console.log( request.readyState );

            if (request.readyState != 4) { return; }
            if (request.status != 200) {
                throw new Error('HTTP error when opening .obj file: ', request.statusText);
            }

            // now we know the file exists and is ready
            // load the file 
            let loaded_mesh = Mesh.from_obj_text(gl, program, request.responseText, material);

            console.log('loaded ', file_name);
            f(loaded_mesh);
            return;
        };


        request.open('GET', file_name); // initialize request. 
        request.send();                   // execute request
    }

}

