folder_name=$(basename $PWD)
target_path=$PWD\_target

if [ -z "$1" ]
  then
    template=index.html
  else
    template=$1
fi

if [ ! -z "$2" ]
  then
    target_path="${target_path/$folder_name/$2}"
fi

rm -r $target_path
mkdir $target_path
cp -R $PWD/* $target_path

sed '/\/\// d' $target_path/application.js.php >> $target_path/application-prepared.js.php

grep -o -P '\".*?\"' $target_path/application-prepared.js.php | grep -o -P '[a-zA-Z0-9\-./]+' | xargs cat > $target_path/application.js

java -jar $HOME/Closure-compiler/compiler.jar --js $target_path/application.js --js_output_file $target_path/application.min.js

cp $target_path/$template $target_path/index.html.tmp
sed 's/application.js.php/application.min.js/g' $target_path/index.html.tmp > $target_path/index.html

rm $target_path/application-prepared.js.php
rm $target_path/application.js
rm $target_path/index.html.tmp

exit 0

