
if [ -z "$1" ]
  then
    template=index.html
  else
    template=$1
fi

folder=firefox-os

sh ./build.sh $template $folder

cd $folder
zip -r ebankomaty.zip *
