import { State } from './ledger-api/state';
import { IOwner } from './constants';

export interface IPoint {
    lat: number;
    lon: number;
}

export interface ILand {
    khasraNo: string;
    village: string;
    subDistrict: string;
    district: string;
    state: string;
    polygonPoints: Array<IPoint>;
    area: number;
    owner: IOwner;
    certificate: string;
    otherDocs: Array<string>;
    parentLandKey: string;
    expired: Boolean;
}

export class Land extends State {
    private khasraNo: string;
    private village: string;
    private subDistrict: string;
    private district: string;
    private state: string;
    private polygonPoints: Array<IPoint>;
    private area: number;
    private owner: IOwner;
    private certificate: string;
    private otherDocs: Array<string>;
    private parentLandKey: string | null;
    private expired: Boolean;

    constructor(obj: ILand) {
        super(Land.getClass(), [
            obj.state,
            obj.district,
            obj.subDistrict,
            obj.village,
            obj.khasraNo,
        ]);
        Object.assign(this, obj);
    }

    getKhasraNo() {
        return this.khasraNo;
    }

    getVillage() {
        return this.village;
    }

    getSubDistrict() {
        return this.subDistrict;
    }

    getDistrict() {
        return this.district;
    }

    getState() {
        return this.state;
    }

    isExpired() {
        return this.expired;
    }

    setExpired() {
        this.expired = true;
    }

    getParentLandKey() {
        return this.parentLandKey;
    }

    isOwner(owner: IOwner) {
        return (
            owner.khataNo === this.owner.khataNo &&
            owner.name === this.owner.name
        );
    }

    getOwner() {
        return this.owner;
    }

    setOwner(owner: IOwner, certificate: string) {
        this.owner = owner;
        this.certificate = certificate;
    }

    static fromBuffer(buffer: Buffer) {
        return Land.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data: Buffer) {
        return State.deserializeClass(data, Land);
    }

    static getClass() {
        return 'landRecord';
    }

    static createInstance(
        khasraNo: string,
        village: string,
        subDistrict: string,
        district: string,
        state: string,
        polygonPoints: Array<IPoint>,
        area: number,
        owner: IOwner,
        certificate: string,
        otherDocs: Array<string>,
        parentLandKey: string | null = null,
        expired: Boolean = false,
    ) {
        return new Land({
            khasraNo,
            village,
            subDistrict,
            district,
            state,
            polygonPoints,
            area,
            owner,
            certificate,
            otherDocs,
            parentLandKey,
            expired,
        });
    }
}
