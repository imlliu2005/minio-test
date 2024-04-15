GDCM 提供了 `gdcmconv` 命令行工具，可以用于转换 DICOM 文件的格式。要将 DICOM 文件转换为 JPEG 2000 格式，你可以使用 `gdcmconv` 工具，并指定输出文件的格式为 JPEG 2000。

以下是使用 `gdcmconv` 将 DICOM 文件转换为 JPEG 2000 格式的示例命令：

```bash
gdcmconv --raw input.dcm output.jp2
```

在这个示例中，`input.dcm` 是要转换的 DICOM 文件，`output.jp2` 是转换后的 JPEG 2000 文件名。

请注意，`gdcmconv` 默认情况下会将 DICOM 文件转换为普通的 JPEG 格式。为了将其转换为 JPEG 2000 格式，你需要添加 `--raw` 选项。

确保在运行命令之前，你已经安装了 GDCM 库，并将 `gdcmconv` 工具添加到了系统的路径中。