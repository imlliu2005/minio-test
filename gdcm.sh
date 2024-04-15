#!/bin/bash

input_dir="/path/to/input_directory"
output_dir="/path/to/output_directory"

# 创建输出目录
mkdir -p $output_dir

# 遍历输入目录中的所有 DICOM 文件
for file in $input_dir/*.dcm; do
    # 提取文件名和扩展名
    filename=$(basename -- "$file")
    extension="${filename##*.}"
    filename="${filename%.*}"

    # 设置输出文件路径
    output_file="$output_dir/$filename.jp2"

    # 执行转换操作
    gdcmconv --raw $file $output_file
done
