from config import app,client,cross_origin
from flask import request

@app.route('/upload-image',methods=['POST'])
@cross_origin(origin='*')
def upload_image():
    bucket='flask-bucket123'
    content_type=request.mimetype
    obj=request.files['file']
    filename=obj.filename
    client.put_object(Body=obj,
          Bucket=bucket,
          Key=filename,
          ContentType=content_type
    )
    return { 'message' : 'file uploaded'}, 200

@app.route("/download-file/<string:filename>",methods=["GET"])
@cross_origin(origin='*')
def getFileToDownload(filename):
      client.download_file('flask-bucket123',filename,"d:\\new-downloads\\"+filename)
      return {"message ": "check the download folder"}, 200