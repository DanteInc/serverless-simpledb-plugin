# serverless-simpledb-plugin

Allows use of variables with cloudformation resource names as needed for SimpleDB.

* http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-simpledb.html
* https://github.com/serverless/serverless/issues/974

## Setup

* Install via npm in the root of your Serverless Project:
```
npm install serverless-simpledb-plugin --save-dev
```

* Add the plugin to the `plugins` array in your Serverless Project's `s-project.json`, like this:

```js
"plugins": [
    "serverless-simpledb-plugin"
]
```

* All done!