//Daniel Fuchs
//CS 442
class Vec4 {

    constructor( x, y, z, w ) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w ?? 0;
    }

    /**
     * Returns the vector that is this vector scaled by the given scalar.
     * @param {number} by the scalar to scale with 
     * @returns {Vec4}
     */
    scaled( by ) {
        let x = this.x * by;
        let y = this.y * by;
        let z = this.z * by;
        let w = this.w * by;
        return new Vec4( x, y, z, w ); // return the new vector
        
    }

    /**
     * Returns the dot product between this vector and other
     * @param {Vec4} other the other vector 
     * @returns {number}
     */
    dot( other ) {
        let x = this.x * other.x;
        let y = this.y * other.y;
        let z = this.z * other.z;
        let w = this.w * other.w;
        return(x + y + z + w); // return the dot product 
    }

    /**
     * Returns the length of this vector
     * @returns {number}
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w); // return the length
    }

    /**
     * Returns a normalized version of this vector
     * @returns {Vec4}
     */
    norm() { //used link to remember how to properly normalize vectors again http://www.fundza.com/vectors/normalize/
        const len = this.length();
        let x = this.x / len;
        let y = this.y / len;
        let z = this.z / len;
        let w = this.w / len;
        return(new Vec4(x,y,z,w)); // return the normalized vector
    }

    /**
     * Returns the vector sum between this and other.
     * @param {Vec4} other 
     */
    add( other ) {
        let x = this.x + other.x;
        let y = this.y + other.y;
        let z = this.z + other.z;
        let w = this.w + other.w;
        return(new Vec4(x,y,z,w)); // return the vector sum
    }

    sub( other ) {
        return this.add( other.scaled( -1 ) );
    }

    cross( other ) {
        let x = this.y * other.z - this.z * other.y;
        let y = this.x * other.z - this.z * other.x;
        let z = this.x * other.y - this.y * other.x;

        return new Vec4( x, y, z, 0 );
    }
	
	toString() {
		return [ '[', this.x, this.y, this.z, this.w, ']' ].join( ' ' );
	}
}
class Vec3 { //will want to be able to cast Vec3 as Vec4 in some way

    constructor( x, y, z ) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Returns the vector that is this vector scaled by the given scalar.
     * @param {number} by the scalar to scale with 
     * @returns {Vec3}
     */
    scaled( by ) {
        let x = this.x * by;
        let y = this.y * by;
        let z = this.z * by;
        return new Vec3( x, y, z ); // return the new vector
        
    }

    /**
     * Returns the dot product between this vector and other
     * @param {Vec3} other the other vector 
     * @returns {number}
     */
    dot( other ) {
        let x = this.x * other.x;
        let y = this.y * other.y;
        let z = this.z * other.z;
        return(x + y + z); // return the dot product 
    }

    /**
     * Returns the length of this vector
     * @returns {number}
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); // return the length
    }

    /**
     * Returns a normalized version of this vector
     * @returns {Vec3}
     */
    norm() { //used link to remember how to properly normalize vectors again http://www.fundza.com/vectors/normalize/
        const len = this.length();
        let x = this.x / len;
        let y = this.y / len;
        let z = this.z / len;
        return(new Vec3(x,y,z)); // return the normalized vector
    }

    /**
     * Returns the vector sum between this and other.
     * @param {Vec3} other 
     */
    add( other ) {
        let x = this.x + other.x;
        let y = this.y + other.y;
        let z = this.z + other.z;
        return(new Vec3(x,y,z)); // return the vector sum
    }

    sub( other ) {
        return this.add( other.scaled( -1 ) );
    }

    cross( other ) {
        let x = this.y * other.z - this.z * other.y;
        let y = this.x * other.z - this.z * other.x;
        let z = this.x * other.y - this.y * other.x;

        return new Vec3( x, y, z );
    }
	
	toString() {
		return [ '[', this.x, this.y, this.z, ']' ].join( ' ' );
	}
}