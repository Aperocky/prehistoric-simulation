source .webconfig
aws s3 cp asset/index.html $AWS_BUCKET_NAME/index.html
aws s3 cp asset/script.min.js $AWS_BUCKET_NAME/script.min.js
aws s3 cp asset/css/xterm.css $AWS_BUCKET_NAME/css/xterm.css
