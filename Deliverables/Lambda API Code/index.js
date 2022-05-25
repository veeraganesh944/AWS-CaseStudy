const AWS = require('aws-sdk');
AWS.config.update({
    region : 'ap-south-1'
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = 'Todos';
const path = '/tasks';

exports.handler = async (event) => {
    console.log('Request event : ', event);
    let response;
    switch(event.httpMethod){
        case 'GET':
            response = await getTasks();
            break;
        case 'POST':
            response = await saveTask(JSON.parse(event.body));
            break;
        case 'PUT':
            const requestBody = JSON.parse(event.body);
            response = await editTask(requestBody.id,requestBody.updateKey,requestBody.updateValue);
            break;
        case 'DELETE':
            response = await deleteTask(JSON.parse(event.body).id);
            break;
        default:
            buildResponse(404,'404 not found');
    }
    return response;
};

async function getTasks(){
    const params = {
        TableName : dynamoDBTableName
    }
    const allTasks = await scanDynamocRecords(params,[]);
    const body = {
        tasks : allTasks
    }
    return buildResponse(200,body);
}

async function scanDynamocRecords(scanParams,itemArray){
    try{
        const dynamoData = await dynamoDB.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        if(dynamoData.LastEvaluateKey){
            scanParams.ExclusiveStartKey = dynamoData.LastEvaluateKey;
            return await scanDynamocRecords(scanParams,itemArray);
        }
        return itemArray;
    }catch(error){
        console.log("Error Found in Get : ",error)
    }
}

async function saveTask(requestBody){
    const params = {
        TableName : dynamoDBTableName,
        Item : requestBody
    }
    return await dynamoDB.put(params).promise().then(() => {
        const body = {
            Operation: 'SAVE',
            Message : 'SUCCESS',
            Item : requestBody
        }
        return buildResponse(201,body);
    },(error) => {
        console.log("Error Found in Save : ",error)
    })
}

async function editTask(id,updateKey,updateValue){
     const params = {
        TableName : dynamoDBTableName,
        Key : {
            'id' : id
        },
        UpdateExpression : `set ${updateKey} = :value`,
        ExpressionAttributeValues : {
            ':value' : updateValue
        },
        returnValues : 'UPDATE_NEW'
    }
    return await dynamoDB.update(params).promise().then((response) => {
        const body = {
            Operation: 'UPDATE',
            Message : 'SUCCESS',
            Item : response
        }
        return buildResponse(200,body);
    },(error) => {
        console.log("Error Found in Update : ",error)
    })
}

async function deleteTask(id){
     const params = {
        TableName : dynamoDBTableName,
        Key : {
            'id' : id
        },
        returnValues : 'ALL_OLD'
    }
     return await dynamoDB.delete(params).promise().then((response) => {
        const body = {
            Operation: 'DELETE',
            Message : 'SUCCESS',
            Item : response
        }
        return buildResponse(200,body);
    },(error) => {
        console.log("Error Found in Delete : ",error)
    })
    
}

function buildResponse(statusCode,body){
    return {
        statusCode : statusCode,
        headers : {
        //    'Content-Type' : 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,DELETE,PUT'
        },
        body : JSON.stringify(body),
        isBase64Encoded: true
    }
}
