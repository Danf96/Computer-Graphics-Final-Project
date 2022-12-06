class Node{
    constructor(x, y, z, heading, pitch, bank, s_x, s_y, s_z, data){
        this.x = x;
        this.y = y;
        this.z = z;

        this.heading = heading; //heading/yaw, pitch, bank/roll
        this.pitch = pitch;
        this.bank = bank; 

        this.scale_x = s_x ?? 1;
        this.scale_y = s_y ?? 1;
        this.scale_z = s_z ?? 1;

        this.data = data;
        this.children = [];
    }
    getMatrix(){
        let matrix = new Mat4();

        matrix = matrix.mul(Mat4.scale(this.scale_x, this.scale_y, this.scale_z));
        matrix = matrix.mul(Mat4.translation(this.x, this.y, this.z));
        matrix = matrix.mul(Mat4.rotation_xz(this.heading));
        matrix = matrix.mul(Mat4.rotation_yz(this.pitch));
        matrix = matrix.mul(Mat4.rotation_xy(this.bank));

        return matrix;
    }

    static getDirMatrix(heading, pitch, bank){
        let matrix = new Mat4();

        matrix = matrix.mul(Mat4.rotation_xz(heading));
        matrix = matrix.mul(Mat4.rotation_yz(pitch));
        matrix = matrix.mul(Mat4.rotation_xy(bank));

        return matrix;
    }
    setScale( x, y, z ) {
        this.scale_x = x;
        this.scale_y = y;
        this.scale_z = z;
    }
    getView(){
        return this.getMatrix().inverse();
    }

    getPos(){
        return this.pos;
    }
    
    translate(x,y,z){
        this.x += x;
        this.y += y;
        this.z += z;
    }

    translateVec(v){
        this.translate(v.x, v.y, v.z);
    }

    warp( x, y, z ) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    warpVec( v ) {
        this.warp( v.x, v.y, v.z );
    }

    rotateHeading(scale){
        this.heading += scale;
        if(this.heading < 0){
            this.heading = 1 + this.heading;
        }
        if (this.heading > 1){
            this.heading %= 1.0;
        }

    }

    rotatePitch(scale){
        this.pitch += scale;
        if(this.pitch < 0){
            this.pitch = 1 + this.pitch;
        }
        if (this.pitch > 1){
            this.pitch %= 1.0;
        }

    }

    rotateBank(scale){
        this.bank += scale;
        if(this.bank < -0.5){
            this.bank = -0.5;
        }
        if(this.bank > 0.5){
            this.bank = 0.5;
        }
    }

    resetPitch(){
        this.pitch = 0;
    }

    resetBank(){
        this.bank = 0;
    }

    moveInDir(x, y, z){
        let matrix = Node.getDirMatrix(this.heading, this.pitch, this.bank);
        let forward = matrix.transform_vec(new Vec4(x, y, z, 0));

        this.translateVec(forward);
    }

    createChildNode(x, y, z, heading, pitch, bank, s_x, s_y, s_z, data){
        let child = new Node(x, y, z, heading, pitch, bank, s_x, s_y, s_z, data);
        this.children.push(child);

        return child;
    }

    getTransformedCoords(){
        let matrix = this.getMatrix();

        return matrix.getTransformedCoords();
    }

    generateRenderBatch(parentMatrix, jobs, lights){
        let matrix = parentMatrix.mul(this.getMatrix());


        if(this.data instanceof Light){ //no sun for scene so not checking
            let coords = matrix.getTransformedCoords();
            lights.push(new RenderLight(coords, this.data.color));
        }
        else if(this.data instanceof Mesh){
            console.log("mesh found!")
            jobs.push(new RenderMesh(matrix, this.data));
        }
        else if(this.data == null){
            //empty node
        }
        else{
            console.log(this);
            throw new Error(
                'unrecognized node data: ' + this.data.constructor.name + ' (' + this.data + ').'
            )
        }
        for (let child of this.children){
            child.generateRenderBatch(matrix, jobs, lights);
        }
    }
}

class RenderLight{
    constructor(loc, color){
        this.loc = loc;
        this.color = color;
    }
}

class RenderMesh{
    constructor(matrix, mesh){
        this.matrix = matrix;
        this.mesh = mesh;
    }
}

class Scene {
    constructor(){
        this.root = new Node( 0, 0, 0, 0, 0, 0, 1, 1, 1 );
        this.cameraNode = this.root;
    }
    generateRenderBatch(jobs, lights){
        this.root.generateRenderBatch(Mat4.identity(), jobs, lights);
    }

    getCameraView(){
        return this.cameraNode.getView();
    }

    setCameraNode(node){
        this.cameraNode = node;
    }

    createNode(x, y, z, yaw, pitch, roll, s_x, s_y, s_z, data){
        let node = this.root.createChildNode(x, y, z, yaw, pitch, roll, s_x, s_y, s_z, data);
        return node;
    }
}