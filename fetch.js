const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const Minio = require('minio');

// MinIO服务器配置
const endPoint = '192.168.110.112';
// const endPoint = '192.168.110.199';
const port = 9000;
const useSSL = false;
const accessKey = 'minio';
const secretKey = 'miniopwd';
const bucketName = 'my-sample-bucket';
const localPath = './downloads/';

// 创建 minio client
const minioClient = new Minio.Client({
    endPoint,
    port,
    useSSL: false,
    accessKey,
    secretKey,
});


// 获取Bucket中的所有对象列表
const listObjects = async () => {
    // 获取存储桶中的所有对象信息
    const objectsList = [];
    await new Promise((resolve, reject) => {
        minioClient.listObjects(bucketName, '', true)
            .on('data', function (obj) {
                objectsList.push(obj);
                resolve(obj);
            })
            .on('error', function (err) {
                reject(err);
            });
    });
    return objectsList;
}

async function downloadObject(objectName) {
    // const downloadURL = `http${useSSL ? 's' : ''}://${endPoint}:${port}/${bucketName}/${objectName}`;
    const downloadURL = await minioClient.presignedGetObject(bucketName, objectName);
    // console.log('urlaa -----> ', downloadURL);
    const filePath = path.join(localPath, objectName);

    try {
        const response = await fetch(downloadURL, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${accessKey}:${secretKey}`).toString('base64')}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to download ${objectName}: ${response.statusText}`);
        }

        const fileStream = fs.createWriteStream(filePath);
        await new Promise((resolve, reject) => {
            response.body.pipe(fileStream);
            response.body.on('error', (err) => {
                reject(err);
            });
            fileStream.on('finish', () => {
                resolve();
            });
        });
        console.log(`Downloaded ${objectName}`);
    } catch (error) {
        console.error(`Error downloading ${objectName}:`, error);
    }
}

async function downloadAllObjects() {
    try {

        const objects = await listObjects();

        const startTime = Date.now();

        await Promise.all(objects.map(obj => downloadObject(obj.name)));

        const endTime = Date.now();
        const downloadTime = (endTime - startTime) / 1000; // 转换为秒
        console.log(`Total download time: ${downloadTime} seconds`);
    } catch (error) {
        console.error('Error downloading objects:', error);
    }
}

downloadAllObjects();
