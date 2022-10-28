import request from "./request";

export default {
    tasks: {
        get(){
            return request({
                url: '/',
            });
        },
        add(data){
            return request({
                url: '/',
                method: 'post',
                data,
            });
        },
        remove(id){
            return request({
                url: `/${id}`,
                method: 'delete',
            });
        },
        change(id){
            return request({
                url: `/${id}`,
                method: 'put',
            });
        },
    }
}
