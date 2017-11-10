/**
 * API
 * 根据 Parameter.ts 检查规则，添加 rule
 */
class API {
    "use strict";

    /** 首页图片目录 */
    homeConfig = {
        api:"/static/home/config.txt", //接口
        //接口匹配规则(Parameter.ts)
        rule:{
            urllist:{
                type: 'array', itemType: 'string',
            }
        }
    };



}

export default new API();

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