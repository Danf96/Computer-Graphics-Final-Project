class CubeMap {
    constructor(gl, blend_mode, program) {
        this.gl = gl;
        this.tex = gl.createTexture();
        this.program = program;
        this.blend_mode = blend_mode;
        this.loaded = false;
        this.image_url = ['/tex/dskye.png', '/tex/dskyw.png', '/tex/dskyt.png', '/tex/dskys.png', '/tex/dskyn.png', '/tex/dskys.png'];
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.tex);
        for (let i = 0; i < 6; i++) {
            gl.texImage2D(
                gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA,
                256, 256, 0,
                gl.RGBA, gl.UNSIGNED_BYTE,
                Material.xor_texture(256)
            );
        }
        if (ext) {
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, ext.TEXTURE_MAX_ANISOTROPY_EXT, 8);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        }
        else {
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, blend_mode);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, blend_mode);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

        }

        this.vertices = [
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,

            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, -1.0,

            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
            -1.0, -1.0, 1.0,

            1.0, -1.0, 1.0,
            1.0, -1.0, -1.0,
            1.0, 1.0, 1.0,

            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, -1.0,

            -1.0, 1.0, 1.0,
            -1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,

            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, -1.0, 1.0,

            1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,

            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,

            -1.0, -1.0, 1.0,
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,

            -1.0, -1.0, 1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0
        ];
        this.verts = create_and_load_vertex_buffer(gl, this.vertices, gl.STATIC_DRAW);
        let image = [];
        let sides_to_load = 6;
        for (let i = 0; i < 6; i++) {
            image[i] = new Image();
            let _tex = this; //alias to this current material for event listener
            gl.texImage2D(
                gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA,
                256, 256, 0,
                gl.RGBA, gl.UNSIGNED_BYTE,
                Material.xor_texture(256)
            );

            image[i].addEventListener('load', function () {
                //_tex.bind(gl);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, _tex.tex);
                gl.texImage2D(
                    gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
                    0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE, image[i]
                );
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

                //_tex.width = image.width;
                //_tex.height = image.height;



                let err = gl.getError();
                if (err != 0) {
                    gl.getError();
                    throw new Error('Error generating mipmap: ' + err);
                }

                err = gl.getError();
                if (err != 0) {
                    gl.getError();
                    throw new Error('Error setting texture parameters: ' + err);
                }

                console.log('loaded texture: ', image.src);

                _tex.loaded = true;

            });
            image[i].src = this.image_url[i];
        }
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }

    render(gl) {
        // let old_prog = gl.getParameter( gl.CURRENT_PROGRAM );
        gl.useProgram(this.program);
        set_vertex_attrib_to_buffer(
            gl, this.program,
            "vert_pos",
            this.verts, 3,
            gl.FLOAT, false, 12, 0
        );
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.tex);
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        gl.useProgram(null);
    }
}