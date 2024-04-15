@REM local
mc alias set localminio http://192.168.110.112:9000 minio miniopwd
@REM mc ls myminio/my-sample-bucket
@REM mc cp -r localminio/my-sample-bucket D:/testmc-download
mc mirror --overwrite localminio/my-sample-bucket D:/testmc-download

@REM delete data from bucket
mc rm --recursive --force localminio/my-sample-bucket/*

@REM remote
mc alias set remoteminio http://192.168.110.199:9000 minio miniopwd
@REM mc ls remoteminio/my-sample-bucket
@REM mc cp -r remoteminio/my-sample-bucket D:/testmc-download
mc mirror --overwrite remoteminio/my-sample-bucket D:/testmc-download



