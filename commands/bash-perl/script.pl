Ll
# Will provide the list of files / folders present inside that path

Ls
# Will list out all the files / folders present inside that path

Pwd
# Provides the current path where we are in 

Zcat $filename.gz  > $filename
# Unzip the file and put it in same directory and same filename

# Unzip $filename

Cat $path

Gunzip

Ls -lrt

Locate *.tar.gz
# Will locate if .tar.gz file is present anywhere

Rm -f *
# Deleting all the file present inside that folder

Rm -r
# Delete the file / folder

Rm -rf
# Will delete the folder

Df -h

cd /usr/apps/vsonadm/vson/data

touch sample1.txt sample2.txt
# Will create the following files

tar -cvf projects.tar.gz sample*.txt

Cksum $filename
# It will check the size by some unique id for that particular file where we can validate it from our server if it is copied / moved.

echo  "<xml>test</xml>"  > test.xml

cat test.xml

File ${filename}

du -h
# Command for getting the file size

# To create files
echo  "<xml>eNB_71375</xml>"  > eNB_71375.HW.xml
cat eNB_71375.HW.xml

echo  "<xml>eNB_7137500879</xml>"  > eNB_7137500879.HW.xml
cat eNB_7137500879.HW.xml

echo  "<xml>FSU_22475</xml>"  > FSU_22475.HW.xml
cat FSU_22475.HW.xml

echo  "<xml>FSU_22475</xml>"  > FSU_2249875.HW.xml
cat FSU_2249875.HW.xml

echo  "<xml>eNB_96700875</xml>"  > eNB_96700875.HW.xml
cat eNB_96700875.HW.xml

echo  "<xml>DU_96700875</xml>"  > DU_96875.HW.xml
cat DU_96875.HW.xml


# To tar the files 
tar -cvzf southlake4S.202401260624.tar.gz eNB_71375.HW.xml eNB_7137500879.HW.xml FSU_22475.HW.xml FSU_2249875.HW.xml eNB_96700875.HW.xml DU_96875.HW.xml

tar -xvzf southlakeS.202401260624.tar.gz -C targetPath
Untar file and copying it into target directory

cp -r east_syracuseS.202301260624.tar.gz /home/jayka5f/apps/data /home/jayka5f/apps/tarfiles || cp east_syracuseS.202301260624.tar.gz /home/tars/
# Copying the file from one directory to another



