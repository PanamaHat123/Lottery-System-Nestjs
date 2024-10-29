
export class AppException extends Error {


    /** 异常码 */
    private code:string;

    /** 异常信息 */
    private info:string;

    constructor( code:string, message:string) {
        super(message);
        this.code = code;
        this.info = message;
    }


}
