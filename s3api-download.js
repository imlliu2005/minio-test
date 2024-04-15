const Minio = require('minio')

// 创建 minio client
const minioClient = new Minio.Client({
    endPoint: '192.168.110.112',
    // endPoint: '192.168.110.199',
    port: 9000,
    useSSL: false,
    accessKey: 'minio',
    secretKey: 'miniopwd',
});


// 下载存储桶中所有对象并测量时间
const bucketName = 'my-sample-bucket';
const downloadDir = './downloads/';

// 查询 buckets
const getBucket = async () => {
    try {
        const buckets = await minioClient.listBuckets()
        console.log('Success', buckets)
        const bucketName = buckets[0].name;
    } catch (err) {
        console.log(err.message)
    }
};

// 下载存储桶中所有对象并测量时间的函数
const downloadAllObjectsAndMeasureTime = async (bucketName, downloadDir) => {
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

    // 获取当前时间
    const startTime = Date.now();
    // 遍历下载所有对象
    await Promise.all(objectsList.map(async (obj) => {
        const objectName = obj.name;
        const filePath = `${downloadDir}/${objectName}`;

        await new Promise((resolve, reject) => {
            minioClient.fGetObject(bucketName, objectName, filePath, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        console.log(`Downloaded '${objectName}' from bucket '${bucketName}' to '${filePath}'`);
    }));

    // 获取下载完成后的时间
    const endTime = Date.now();

    // 计算下载时间
    const downloadTime = endTime - startTime;

    console.log(`Downloaded all objects from bucket '${bucketName}' in ${downloadTime} milliseconds`);
}

// 下载所用数据并计算时间
downloadAllObjectsAndMeasureTime(bucketName, downloadDir)
    .catch(err => {
        console.error('Error downloading objects:', err);
    });