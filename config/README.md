{
	"id": "1244db73-498a-cdcc-6955-cb82c158f523",
	"name": "wechat",
	"description": "",
	"order": [
		"aa2cacb6-1128-b23f-62c7-7ab63076d8ff",
		"33193036-149e-66a5-12ae-e30c528e7925",
		"acc8f537-9e39-3d06-aaee-892b75484130",
		"0a81367b-c765-b225-2ca1-a72159158d33",
		"48462f08-d58f-b286-0124-71a71868dad9"
	],
	"folders": [],
	"folders_order": [],
	"timestamp": 1557221480484,
	"owner": 0,
	"public": false,
	"requests": [
		{
			"id": "0a81367b-c765-b225-2ca1-a72159158d33",
			"headers": "",
			"headerData": [],
			"url": "127.0.0.1:3330/wechat/template/list",
			"queryParams": [],
			"pathVariables": {},
			"pathVariableData": [],
			"preRequestScript": null,
			"method": "GET",
			"collectionId": "1244db73-498a-cdcc-6955-cb82c158f523",
			"data": null,
			"dataMode": "params",
			"name": "模板列表",
			"description": "",
			"descriptionFormat": "html",
			"time": 1559204634800,
			"version": 2,
			"responses": [],
			"tests": null,
			"currentHelper": "normal",
			"helperAttributes": {}
		},
		{
			"id": "33193036-149e-66a5-12ae-e30c528e7925",
			"headers": "",
			"headerData": [],
			"url": "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx6bce565776a81ced&secret=b2b49cfc626b99a42536837928a32893",
			"queryParams": [
				{
					"key": "grant_type",
					"value": "client_credential",
					"equals": true,
					"description": "",
					"enabled": true
				},
				{
					"key": "appid",
					"value": "wx6bce565776a81ced",
					"equals": true,
					"description": "",
					"enabled": true
				},
				{
					"key": "secret",
					"value": "b2b49cfc626b99a42536837928a32893",
					"equals": true,
					"description": "",
					"enabled": true
				}
			],
			"pathVariables": {},
			"pathVariableData": [],
			"preRequestScript": null,
			"method": "GET",
			"collectionId": "1244db73-498a-cdcc-6955-cb82c158f523",
			"data": null,
			"dataMode": "params",
			"name": "获取token",
			"description": "",
			"descriptionFormat": "html",
			"time": 1557221525215,
			"version": 2,
			"responses": [],
			"tests": null,
			"currentHelper": "normal",
			"helperAttributes": {}
		},
		{
			"id": "48462f08-d58f-b286-0124-71a71868dad9",
			"headers": "Content-Type: application/json\nAccess-Token: Mjg2RjRBQTk4ODk5REI5MjRFM0MxMEVDRTE5QjM3RDJCODVGQjM4NjNGM0QyNDIyNjRDNkM3RTM4RDE1NzJDMA==\n",
			"headerData": [
				{
					"key": "Content-Type",
					"value": "application/json",
					"description": "",
					"enabled": true
				},
				{
					"key": "Access-Token",
					"value": "Mjg2RjRBQTk4ODk5REI5MjRFM0MxMEVDRTE5QjM3RDJCODVGQjM4NjNGM0QyNDIyNjRDNkM3RTM4RDE1NzJDMA==",
					"description": "",
					"enabled": true
				}
			],
			"url": "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=23_KdHhrw1tTeeXexj4LSCBY6RYLFW9Nvg5xGOxLgrWM1q-t2mDdv4EiVVRwiTF5vO-WS6QUJd4T6mBhpOItSRrSokrLZU8n8vQ-bcIGpVefuLwE5q2enUEkgbpXuFJcUGRbeCStNUYqA2G6t8jOFIiAEAXOR",
			"queryParams": [
				{
					"key": "access_token",
					"value": "23_KdHhrw1tTeeXexj4LSCBY6RYLFW9Nvg5xGOxLgrWM1q-t2mDdv4EiVVRwiTF5vO-WS6QUJd4T6mBhpOItSRrSokrLZU8n8vQ-bcIGpVefuLwE5q2enUEkgbpXuFJcUGRbeCStNUYqA2G6t8jOFIiAEAXOR",
					"equals": true,
					"description": "",
					"enabled": true
				}
			],
			"pathVariables": {},
			"pathVariableData": [],
			"preRequestScript": null,
			"method": "POST",
			"collectionId": "1244db73-498a-cdcc-6955-cb82c158f523",
			"data": [],
			"dataMode": "raw",
			"name": "自定义菜单",
			"description": "",
			"descriptionFormat": "html",
			"time": 1563173480263,
			"version": 2,
			"responses": [],
			"tests": null,
			"currentHelper": "normal",
			"helperAttributes": {},
			"rawModeData": "{\n     \"button\":[\n     {    \n          \"type\":\"click\",\n          \"name\":\"今日课程\",\n          \"key\":\"V1001_TODAY_MUSIC\"\n      },\n      {\n           \"name\":\"菜单\",\n           \"sub_button\":[\n           {    \n               \"type\":\"view\",\n               \"name\":\"学员中心\",\n               \"url\":\"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9bb9b35bb6d4f980&redirect_uri=http%3A%2F%2Fyangjin-art.top%2Fwechat%2F%23%2F&response_type=code&scope=snsapi_base#wechat_redirect\"\n            },\n            {\n               \"type\":\"click\",\n               \"name\":\"赞一下我们\",\n               \"key\":\"V1001_GOOD\"\n            }]\n       }]\n }"
		},
		{
			"id": "aa2cacb6-1128-b23f-62c7-7ab63076d8ff",
			"headers": "Content-Type: application/json\n",
			"headerData": [
				{
					"key": "Content-Type",
					"value": "application/json",
					"description": "",
					"enabled": true
				}
			],
			"url": "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=21_xIsQdgcaLfSqn9vZLp4nJU3OHAXce8fXmqwocm8Jii7G_g8wpx7u6IDhmPDyAEcHTRKXYfwrsUYVYl7AUV_5_ifeH6wPnfSJ5sI_i526R8olfFsDqODk1aWkSWEjnpyJufpOKVKGzRhFn4qSVQBcABADYJ",
			"queryParams": [
				{
					"key": "access_token",
					"value": "21_xIsQdgcaLfSqn9vZLp4nJU3OHAXce8fXmqwocm8Jii7G_g8wpx7u6IDhmPDyAEcHTRKXYfwrsUYVYl7AUV_5_ifeH6wPnfSJ5sI_i526R8olfFsDqODk1aWkSWEjnpyJufpOKVKGzRhFn4qSVQBcABADYJ",
					"equals": true,
					"description": "",
					"enabled": true
				}
			],
			"pathVariables": {},
			"pathVariableData": [],
			"preRequestScript": null,
			"method": "POST",
			"collectionId": "1244db73-498a-cdcc-6955-cb82c158f523",
			"data": [],
			"dataMode": "raw",
			"name": "模板消息发送",
			"description": "",
			"descriptionFormat": "html",
			"time": 1557221506539,
			"version": 2,
			"responses": [],
			"tests": null,
			"currentHelper": "normal",
			"helperAttributes": {},
			"rawModeData": "{ \n  \"touser\": \"oVB5OwyVDKfTZq4T61_p2roSg1tA\",\n  \"template_id\": \"arueuQozNMNHBZ7BQ5hsCzxxC9X38tJ1Kmu7Oa1JjEY\",\n  \"url\": \"http://weixin.qq.com/download\",\n  \"data\": {\n    \"first\": {\n      \"value\": \"身份信息\",\n      \"color\": \"#173177\"\n    },\n    \"keyword1\": {\n      \"value\": \"张三\",\n      \"color\": \"#1d1d1d\"\n    },\n    \"keyword2\": {\n      \"value\": \"男\",\n      \"color\": \"#1d1d1d\"\n    },\n    \"keyword3\": {\n      \"value\": \"45\",\n      \"color\": \"#1d1d1d\"\n    },\n    \"remark\": {\n      \"value\": \"已登记！\",\n      \"color\": \"#173177\"\n    }\n  }\n}"
		},
		{
			"id": "acc8f537-9e39-3d06-aaee-892b75484130",
			"headers": "Content-Type: application/json\n",
			"headerData": [
				{
					"key": "Content-Type",
					"value": "application/json",
					"description": "",
					"enabled": true
				}
			],
			"url": "127.0.0.1:3330/wechat/userInfo",
			"queryParams": [],
			"pathVariables": {},
			"pathVariableData": [],
			"preRequestScript": null,
			"method": "POST",
			"collectionId": "1244db73-498a-cdcc-6955-cb82c158f523",
			"data": [],
			"dataMode": "raw",
			"name": "获取用户信息",
			"description": "",
			"descriptionFormat": "html",
			"time": 1558518421982,
			"version": 2,
			"responses": [],
			"tests": null,
			"currentHelper": "normal",
			"helperAttributes": {},
			"rawModeData": "{\"openid\": \"oVB5OwyVDKfTZq4T61_p2roSg1tA\"}"
		}
	]
}