# Get Gruntify Pics
A simple tool to download and sort all the pictures in a Gruntify export CSV by their reference ID and field name. 

## Installation
This tool is a Node.JS based script. You must install [Node](https://nodejs.org/en/) to be able to run it (LTS version recommended).

Once Node is installed, clone or download this repository and open a terminal window in its directory.
Run ```npm init``` to download all the required dependencies. 

Everything is now installed and ready to use.

## Usage
This tool will expect you to place the export CSV from Gruntify into its directory and name it ```input.csv```. Once you have done so, and you have configured the tool with your required settings, you can run it by opening a terminal window in its directory and executing: <br>
```npm run start```

### Configuration
All configuration for this tool occurs in the ```config.json``` file. There are 4 options in here:
1. fields: <br>
    This allows you to specify all of the fields in the input CSV file which contain URLs of images. By default, this is set to just ```["Media"]```, but you can add additional fields like so: <br>
    ```["Media", "Field 2", "Field 3"]``` <br>
    The field name used here must **exactly** match the name in the CSV, it is recommended for you to copy/paste it in.
    > Note: You can usually tell which fields will contain image URLs as they will end with a tag like: (Photos-xxxx).

2. rate-limit: <br>
    This specifies the maximum number of concurrent downloads for the tool at any one time. The default value is 10, but you may be able to increase it. Setting a rate too high will result in the tool failing as the server will time it out for spam.

3. results-directory: <br>
    This is the directory in which the result images will be stored. The default is ```./results```. If the directory does not exist then the tool will create it for you so long as you have the permission to do so. It is recommended that the results directory is always within the tool's own directory and so this value should always start with './'.

4. direct-json: (Advanced) <br>
    This is a boolean value (set to ```false``` by default) that specifies whether the tool should skip CSV to JSON conversion and instead take input from a file named ```input.json```. This option is mainly for use in situations where you have already converted your CSV input to JSON using another tool. However, this tool does not allow for any field in the entries to contain an array. If you have multiple images in one field, instead use a comma seperated string. 
    >This option will **not** support direct geojson exports from Gruntify as they follow a different format. Instead export to CSV and leave this set to false.

### Image Name Format
The image files generated by this tool have a non-configurable file naming scheme at this time. The scheme is as follows:
```<ref>-<field>-<i>.jpg```

```<ref>``` = The reference ID of the entry the image belongs to. <br>
```<field>``` = The name of the field the image was found in. <br>
```<i>``` = An incrementing value used to distinguish between multiple images in the same field/reference pairing.

## Errors
The two main types of errors that may occur relate to the input format and the image server response.

If the tool crashes with an error relating to reading a value that doesn't exist, it probably has to do with the format of the input. Make sure you are using a direct CSV export from Gruntify, and if you are using the ```direct-json``` option, try again with a CSV input file. If the issue still occurs, consider opening an issue report. 

If the tool crashes with an error relating to the server request of the image, there are a couple of possible reasons:
- The ```rate-limit``` was set too high, and the server timed out the tool for making too many requests
- The URLs of the images have expired

If this occurs, try lowering the rate limit. If the issue is still not resolved, you may need to generate a new export in Gruntify and try again.
>Note: In testing we have found that some exports will have URLs which expire as soon as 2 hours after creation. It is recommended you run this tool ASAP after export.
