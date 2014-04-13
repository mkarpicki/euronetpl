
if [ -z "$1" ]
  then
    template=index.html
  else
    template=$1
fi

folder=firefox-os

zip -r ebankomaty.zip *

sh ./build.sh $template $folder

