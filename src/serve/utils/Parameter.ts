declare let require:any;
/**
 * 因此插件使用es6关键字class书写，babel几经折腾都无法在ie11上使用，暂时拷贝到assets目录使用
 */
let Parameter = require('../../assets/lib/parameter');
// import Parameter from '../../assets/lib/parameter';

/**
 * rule example
    let rule = {
        name: 'string',
        age: {type: 'int', max: 200},
        gender: ['male', 'female'],
        working: 'boolean',
        salary: {type: 'number', min: 0},
        birthday: 'date',
        now: 'dateTime',
        id: 'id',
        childrens: {
            type: 'array',
            itemType: 'object',
            required: false,
            rule: {
                name: 'string',
                age: 'int',
                gender: ['male', 'female'],
                birthday: {type: 'date', required: false}
            }
        },
        mate: {
            type: 'object',
            required: false,
            rule: {
                name: 'string',
                age: 'int',
                gender: ['male', 'female'],
                birthday: {type: 'date', required: false}
            }
        }
    };
*/

let parameter = new Parameter();

/**
 * validate 参数格式验证
 * @param rules     object  规则
 * @param value     object  匹配的值
 */
function validate<T, K>(rules:T, value:K):Promise<{}> {
    return new Promise((resolve, reject)=>{
        let invalidList =  parameter.validate(rules, value);
        invalidList = null;
        if(invalidList){
            console.log("==============>", invalidList)
            let error:string = "Server API error : [ "+invalidList[0]['field']+" ]  "+invalidList[0]['message']
            reject(error);
        }else {
            resolve();
        }
    })
}

export {validate}
