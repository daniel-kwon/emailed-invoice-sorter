function emailAttachmentsToDrive(){
  var thread1 = GmailApp.search(''); //INSERT QUERY HERE
  var thread2 = GmailApp.search(''); //INSERT QUERY HERE
  
  var threads = [thread1,thread2];             //Threads
  var folderName = ['thread1', 'thread2'];     //Folder Names
  var labelName = 'Added to Drive';            //Label name for completed emails
  var label = getGmailLabel_(labelName);
  
  for(var z = 0; z < threads.length; z++){
    var parentFolder;
    if(threads[z].length < 0){
      continue;
    }
    var root = DriveApp.getRootFolder();
    for(var i = 0; i < threads[z].length; i++){
      var mesgs = threads[z][i].getMessages();
      for(var j in mesgs){
        //get attachments
        var mesg_year = mesgs[j].getDate().getFullYear();
        parentFolder = getFolder_(folderName[z],mesg_year);
        var attachments = mesgs[j].getAttachments();
        for(var k in attachments){
          var attachment = attachments[k];
          var attachmentBlob = attachment.copyBlob();
          var file = DriveApp.createFile(attachmentBlob);
          parentFolder.addFile(file);
          root.removeFile(file);
        }
      }
      threads[z][i].addLabel(label);
    }
  }
}



//This function will get the parent folder in Google drive
function getFolder_(folderName,mesg_year){
  var parentFolder;
  var folder;
  var parent_fi = DriveApp.getFoldersByName(folderName);
  if(parent_fi.hasNext()){
    parentFolder = parent_fi.next();
    var child_fi = parentFolder.getFoldersByName(mesg_year);
    if(child_fi.hasNext()){
      folder = child_fi.next();
    }
    else{
      folder = parentFolder.createFolder(mesg_year);
    }
  }
  else{
    parentFolder = DriveApp.createFolder(folderName);
    folder = parentFolder.createFolder(mesg_year);
  }
  return folder;
}

//This function will get the specified Gmail label
function getGmailLabel_(name){
  var label = GmailApp.getUserLabelByName(name);
  if(!label){
    label = GmailApp.createLabel(name);
  }
  return label;
}
