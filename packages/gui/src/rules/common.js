import { query } from "@/services/graphql";

const uniqueNameValidate = (n, mode, _where)=>{
	return async (_rule, value) => {
		if(!value){
			return Promise.resolve();
		}else{
			let filters = ``;
			filters += `${n}: { eq:"${value}" }`;
			if(_where){
				Object.keys(_where).forEach((_key)=>{
					if(_key == "id"){
						if(!!_where[_key]){
							filters += `, id: { ne:${_where[_key]} }`;
						}
					}else if(_where[_key] == null){
						filters += `, ${_key}: { id:{null:true} }`;
					}else if(!isNaN(_where[_key]*1)){
						if(_where[_key]!=""){
							filters += `, ${_key}: { id:{eq:"${_where[_key]}"} }`;
						}
					}else{
						filters += `, ${_key}: { eq:"${_where[_key]}" }`;
					}
				});
			}
			return new Promise((resolve, reject) => {
				query(`${mode}(filters: {${filters}}, pagination:{start: 0, limit: 1}){
					data{id}
				}`)
				.then((res) => {
					if(res.data && res.data.length>0){
						return reject('Name already exists');
					}else{
						return resolve();
					}
				});
			});
		}
	}
}

const rules = {
	required: [
		{
			required: true,
			message: "This is required",
			whitespace: true,
			trigger: "blur",
		},
	],
	numberRequired: [
		{
			required: true,
			message: "This is required",
			trigger: "blur",
			type: "number",
		},
	],
	arrayRequired: [
		{
			required: true,
			type: "array",
			message: "This is required",
			whitespace: true,
			trigger: "blur",
		},
	],
	objectRequired: [
		{
			required: true,
			type: "object",
			message: "This is required",
			whitespace: true,
			trigger: "blur",
		},
	],
	name: [
		{
			required: true,
			message: "Name is required",
			whitespace: true,
			trigger: "blur",
		},
	],
	uniqueGlobalId:(mode, where) => {
		return [
			{
				required: true,
				message: "Global ID is required",
				whitespace: true,
				trigger: "blur",
			},
			{
				message: "Global ID already exists",
				asyncValidator: uniqueNameValidate('globalId', mode, where),
				trigger: "blur",
			},
		];
	},
	uniqueName:(mode, where) => {
		return [
			{
				required: true,
				message: "Name is required",
				whitespace: true,
				trigger: "blur",
			},
			{
				message: "Name already exists",
				asyncValidator: uniqueNameValidate('name', mode, where),
				trigger: "blur",
			},
		];
	},
	uniqueUserName:(mode, where) => {
		return [
			{
				required: true,
				message: "Name is required",
				whitespace: true,
				trigger: "blur",
			},
			{
				message: "Name already exists",
				asyncValidator: uniqueNameValidate('username', mode, where),
				trigger: "blur",
			},
		];
	},
	email: [
		{
			required: true,
			message: "This is required",
			whitespace: true,
			trigger: "blur",
		},
		{
			type: "email",
			message: "Email is not a valid email",
			whitespace: true,
			trigger: "blur",
		},
	],
	password: [
		{
			min: 8,
			pattern: /.{8,}/,
			required: true,
			message: "Password least 8 characters long",
			whitespace: true,
			trigger: "blur",
		},
	],
	path: [
	  {
	    required: true,
	    message: "This is required",
	    whitespace: true,
	    trigger: "blur",
	  },
	  {
	    max: 256,
	    message: "Path cannot be longer than 256 characters",
	    whitespace: true,
	    trigger: "blur",
	  },
	],
	port: [
	  {
	    required: true,
	    type: "number",
	    message: "This is required",
	    whitespace: true,
	    trigger: "blur",
	  },
	  {
	    min: 1,
	    max: 65535,
	    type: "number",
	    message: "The port is between 1 and 65535",
	    whitespace: true,
	    trigger: "blur",
	  }
	],
	weight: [
	  {
	    required: true,
	    type: "number",
	    message: "This is required",
	    whitespace: true,
	    trigger: "blur",
	  },
	  {
	    min: 1,
	    max: 99999,
	    type: "number",
	    message: "The weight is between 1 and 99999",
	    whitespace: true,
	    trigger: "blur",
	  }
	],
	httpUrl: [
	  {
	    required: true,
	    message: "This is required",
	    whitespace: true,
	    trigger: "blur",
	  },
	  {
	    max: 256,
	    message: "HttpUrl cannot be longer than 256 characters",
	    whitespace: true,
	    trigger: "blur",
	  },
	],
}
export default rules;