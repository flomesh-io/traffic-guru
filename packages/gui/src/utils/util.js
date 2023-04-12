import enquireJs from "enquire.js";
import _ from "lodash";
import moment from "moment";

export function isPro() {
  return process.env.VUE_APP_VERSION == "pro";
}

export function isK8SKey(n) {
  return (
    localStorage.getItem("SCHEMA_TYPE") == "k8s" ||
    (localStorage.getItem("SCHEMA_TYPE") != "k8s" &&
      n.indexOf("workload.") == -1)
  );
}

export function isFreeKey(n) {
  return n.indexOf("flb.") == -1 && n.indexOf("openapi.") == -1;
}

export function isDef(v) {
  return v !== undefined && v !== null;
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

export function importApi(that) {
  let ipt = document.createElement("input");
  ipt.type = "file";
  //ipt.webkitdirectory = true
  ipt.click();
  let file = null;
  ipt.addEventListener("change", (e) => {
    file = e.target.files[0];

    let fileSelect = file;
    let reader = new FileReader();
    if (typeof FileReader === "undefined") {
      console.log("Your browser does not support the FileReader interface");
      return;
    }
    reader.readAsText(fileSelect, "gb2312");
    reader.onload = function () {
      that.$nextTick(() => {
        const json = JSON.parse(reader.result);
        if (json.swagger) {
          importSwagger(that, reader);
          return;
        }
        const content = reader.result;
        that.$router.push({
          name: "API Create",
          params: { content },
        });
      });
    };
  });
}

function importSwagger(that, reader) {
  const json = JSON.parse(reader.result);
  let content = {
    plugins: [],
    versions: {},
    systemCode: [],
    endpoints: [],
    providers: [],
    msg: [[""], [], [""], []],
    isCanary: false,
  };
  let endpointInit = {
    path: "",
    host: "",
    dubboMethodName: "",
    regExpPriority: 1,
    denyenable: false,
    methods: ["GET"],
    preserveHost: false,
    dubboMethodSignature: "",
    protocols: json.schemes,
    stripPath: true,
  };

  let providerInit = {
    name: "",
    content: "",
    path: "",
    versions: ["1"],
    upstream: {
      id: null,
    },
    protocols: json.schemes,
    type: "Host",
  };
  for (let k in json.paths) {
    let path = json.paths[k];
    let endpoint = Object.assign({}, endpointInit);
    endpoint.path = k;
    endpoint.methods = Object.keys(path);
    endpoint.params = path;
    content.endpoints.push(endpoint);

    let provider = Object.assign({}, providerInit);
    provider.name = k;
    provider.path = k;
    content.providers.push(provider);
  }
  content = JSON.stringify(content);
  that.$router.push({
    name: "API Create",
    params: { content, spec: reader.result },
  });
}

export function importInterface(that) {
  let ipt = document.createElement("input");
  ipt.type = "file";
  ipt.click();
  let file = null;
  ipt.addEventListener("change", (e) => {
    file = e.target.files[0];

    that.importIinterface.name = file.name;
    let fileSelect = file;
    let reader = new FileReader();
    if (typeof FileReader === "undefined") {
      console.log("Your browser does not support the FileReader interface");
      return;
    }
    reader.readAsText(fileSelect, "gb2312");
    reader.onload = function () {
      that.$nextTick(() => {
        try {
          const json = JSON.parse(reader.result);
          that.importIinterface.json = json;
        } catch (error) {
          that.$message.error({
            content: that.$t("The file format is incorrect"),
          });
        }
      });
    };
  });
}

export function isRegExp(v) {
  return _toString.call(v) === "[object RegExp]";
}

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true);
    },
    unmatch: function () {
      call && call(false);
    },
  };
  enquireJs.register("only screen and (max-width: 767.99px)", handler);
}

/**
 * restruct an item from an array.
 */
export function restructAddress(data) {
  let _address = [];
  for (let i = 0; i < data.length; i++) {
    _address.push(restructAddressItem(data[i], data[i].type));
  }
  return _address;
}

/**
 * restruct item 
 */
export function restructAddressItem(data, type, index) {
	let ip = data.ip;
	let item = {};
	item.id = index || 0;
	item.type = type;
	if (type == 1) {
		let _ary = ip.split(".");
		item.a = _ary[0];
		item.b = _ary[1];
		item.c = _ary[2];
		item.d = 0;
		item.suffix = 0;
	} else if (type == 2) {
		let _ary = ip.split("-");
		let _ary1 = _ary[0].split(".");
		let _ary2 = _ary[1].split(".");
		item.a = _ary1[0];
		item.b = _ary1[1];
		item.c = _ary1[2];
		item.d = _ary1[3];
		item.suffix = _ary2[3];
	} else if (type == 3) {
		let _ary = ip.split("/");
		let _ary1 = _ary[0].split(".");
		item.a = _ary1[0];
		item.b = _ary1[1];
		item.c = _ary1[2];
		item.d = _ary1[3];
		item.suffix = _ary[1];
	} else if (type == 4) {
		let _ary = ip.split(".");
		item.a = _ary[0];
		item.b = _ary[1];
		item.c = _ary[2];
		item.d = _ary[3];
		item.suffix = 0;
	} else if (type == 5) {
		let _ary = ip.split("-");
		let _ary1 = _ary[0].split(":");
		let _ary2 = _ary[1].split(":");
		item.d = _ary1.pop();
		item.a = _ary1.join(":");
		item.suffix = _ary2.pop();
	} else if (type == 6) {
		let _ary = ip.split("/");
		item.a = _ary[0];
		item.suffix = _ary[1];
	}
  return item;
}

/**
 * build an item from an array.
 */
export function buildAddress(data) {
  let ary = [];
  for (let i = 0; i < data.length; i++) {
		ary.push(buildAddressItem(data[i], data[i].type));
  }
  return ary;
}

/**
 * build item
 */
export function buildAddressItem(d, type) {
  let item = {};
	if (type == 1) {
		item = { type: type, ip: `${d.a}.${d.b}.${d.c}.x` };
	} else if (type == 2) {
		item = {
			type: type,
			ip: `${d.a}.${d.b}.${d.c}.${d.d}-${d.a}.${d.b}.${d.c}.${d.suffix}`,
		};
	} else if (type == 3) {
    if (!d.a || !d.b || !d.c || !d.d || !d.suffix) {
      item = { type: type, ip: `0.0.0.0/0` };
    } else {
      item = { type: type, ip: `${d.a}.${d.b}.${d.c}.${d.d}/${d.suffix}` };
    }
	} else if (type == 4) {
		item = { type: type, ip: `${d.a}.${d.b}.${d.c}.${d.d}` };
	} else if (type == 5) {
		item = {
			type: type,
			ip: `${d.a}:${d.d}-${d.a}:${d.suffix}`,
		};
	} else if (type == 6) {
		item = { type: type, ip: `${d.a}/${d.suffix}` };
	}
  return item;
}


export function initResources(permissions, defaultResources) {
  let rtnResources = _.cloneDeep(defaultResources);
  rtnResources.forEach((resource) => {
    let _merge = {};
    permissions.forEach((permission) => {
      if (resource.name == permission.controller) {
        _merge[permission.action] = permission.enabled;
      }
    });
    resource.actions.forEach((action) => {
      action.enabled = _merge[action.name];
    });
  });
  return rtnResources;
}

const _toString = Object.prototype.toString;

export const defaultPolicySetting = [
  {
    name: "signencrypt",
    label: "Sign Encrypt",
    fields: [
      {
        name: "sm2_pubic_key",
        label: "Sm2 Pubic Key",
        type: "text",
      },
      {
        name: "sm2_private_key",
        label: "Sm2 Private Key",
        type: "text",
      },
    ],
    switch: true,
  },
  {
    name: "attedecryp",
    label: "Encrypt Attestation",
    fields: [
      {
        name: "sm2_pubic_key",
        label: "Sm2 Pubic Key",
        type: "text",
      },
      {
        name: "sm2_private_key",
        label: "Sm2 Private Key",
        type: "text",
      },
    ],
    switch: true,
  },
  {
    name: "verify_sign",
    label: "Verify Sign",
    fields: [
      {
        label: "Middlemanup Url",
        name: "middlemanup_url",
        type: "text",
      },
      {
        label: "Middlemandown Url",
        name: "middlemandown_url",
        type: "text",
      },
      {
        label: "Predicate",
        name: "predicate",
        type: "select",
        values: [
          { value: "", label: "None" },
          { value: "status", label: "status" },
          { value: "json.code", label: "json.code" },
        ],
      },
      {
        label: "Decrypt",
        name: "decrypt",
        type: "boolean",
        value: false,
      },
    ],
    switch: true,
  },
  {
    name: "decrypt",
    label: "Decrypt",
    fields: [
      {
        label: "Algorithm",
        name: "algorithm",
        type: "text",
      },
      {
        label: "Key",
        name: "key",
        type: "text",
      },
      {
        label: "Iv",
        name: "iv",
        type: "text",
      },
      {
        label: "Content Type",
        name: "content_type",
        type: "text",
      },
    ],
    switch: true,
  },
  {
    name: "encrypt",
    label: "Encrypt",
    fields: [
      {
        label: "Algorithm",
        name: "algorithm",
        type: "text",
      },
      {
        label: "Key",
        name: "key",
        type: "text",
      },
      {
        label: "Iv",
        name: "iv",
        type: "text",
      },
      {
        label: "Content Type",
        name: "content_type",
        type: "text",
      },
    ],
    switch: true,
  },
  {
    name: "forward_proxy",
    label: "Forward Proxy",
    fields: [
      {
        label: "Proxy Host",
        name: "proxy_host",
        type: "text",
      },
      {
        label: "Https Verify",
        name: "https_verify",
        value: false,
        type: "boolean",
      },
      {
        label: "Proxy Port",
        name: "proxy_port",
        type: "number",
      },
      {
        label: "Proxy Scheme",
        name: "proxy_scheme",
        type: "text",
        value: "https",
      },
    ],
    switch: true,
  },
  {
    name: "request_termination",
    label: "Request Termination",
    fields: [
      {
        label: "Status Code",
        name: "status_code",
        type: "text",
      },
      {
        label: "Message",
        name: "message",
        type: "text",
      },
    ],
    switch: true,
  },
  {
    name: "response_transformer",
    label: "Response Transformer",
    fields: [
      {
        label: "Headers",
        name: "headers",
        type: "text",
        rows: 5,
      },
      {
        label: "Text",
        name: "text",
        type: "text",
        rows: 5,
      },
    ],
    switch: true,
  },
  {
    name: "whitelist",
    label: "URI PREFIX MATCH",
    fields: [
      {
        label: "Whitelist",
        name: "whitelist",
        type: "text",
        rows: 15,
      },
    ],
    switch: true,
  },
  {
    name: "esb",
    label: "ESB",
    fields: [],
    switch: true,
  },
];

export function getTimeLabel(val, date) {
  let _d = moment(new Date(val * 1));
  switch (date) {
    case "1 second":
    case "5 minute":
      return _d.format("HH:mm:ss");
    case "30 minute":
    case "1 hour":
      return _d.format("HH:mm");
    case "6 hour":
    case "12 hour":
    case "1 day":
      return _d.format("MM-DD HH:mm");
    case "3 day":
    case "7 day":
    case "15 day":
    case "1 month":
      return _d.format("MM-DD");
    default:
      return _d.format("MM-DD HH:mm");
  }
}

export function getTimeline(date) {
  switch (date) {
    case "1 second":
    case "5 minute":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 second)";
    case "30 minute":
    case "1 hour":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 minute)";
    case "6 hour":
    case "12 hour":
    case "1 day":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 hour)";
    case "3 day":
    case "7 day":
    case "15 day":
    case "1 month":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 day)";
    default:
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 second)";
  }
}

export function getTimeUnit(date) {
  switch (date) {
    case "1 second":
    case "5 minute":
      return "sec";
    case "30 minute":
    case "1 hour":
      return "min";
    case "6 hour":
    case "12 hour":
    case "1 day":
      return "hour";
    case "3 day":
    case "7 day":
    case "15 day":
    case "1 month":
      return "day";
    default:
      return "sec";
  }
}

export function getSteamTimeline(date) {
  switch (date) {
    case "1 second":
    case "5 minute":
    case "30 minute":
    case "1 hour":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 second)";
    case "6 hour":
    case "12 hour":
    case "1 day":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 minute)";
    case "3 day":
    case "7 day":
    case "15 day":
    case "1 month":
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 hour)";
    default:
      return "toStartOfInterval(toDateTime(resTime/1000),interval 1 second)";
  }
}

export function clickhouseResult2Array(data) {
  let result = [];
  let nodes = data.split("\n");
  nodes.map((nodeStr) => {
    result.push(nodeStr.split("\t"));
  });
  return result;
}
