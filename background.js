chrome.webNavigation.onCommitted.addListener(function(details) {
    if (details.frameId === 0) { // Ensures this runs only for the main frame, not iframes
      chrome.storage.local.get(['redirectTimestamp', 'redirectDate', 'redirectedTabs', 'redirectStop'], function(data) {
        const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
        const currentTime = new Date().getTime();
  
        // If the date has changed or there's no timestamp, reset the timestamp and redirectedTabs
        if (data.redirectDate !== currentDate || !data.redirectTimestamp) {
          chrome.storage.local.set({redirectTimestamp: currentTime, redirectDate: currentDate, redirectedTabs: {}, redirectStop: false});
          data.redirectedTabs = {};
        }
  
        // Calculate the time difference in seconds
        const timeDiff = (currentTime - (data.redirectTimestamp || currentTime)) / 1000;
  
        // Check if the redirection window is still active
        if (timeDiff < 30 && !data.redirectStop) {
          // Check if the tab has already been redirected
          const redirectedTabs = data.redirectedTabs || {};
          const tabAlreadyRedirected = redirectedTabs[details.tabId];
  
          if (!tabAlreadyRedirected) {
            const bookNames = [
              "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
              "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", 
              "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", 
              "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", 
              "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", 
              "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", 
              "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", 
              "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", 
              "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
            ];
  
            const chapterCounts = {
              "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36, "Deuteronomy": 34, 
              "Joshua": 24, "Judges": 21, "Ruth": 4, "1 Samuel": 31, "2 Samuel": 24, "1 Kings": 22, 
              "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36, "Ezra": 10, "Nehemiah": 13, 
              "Esther": 10, "Job": 42, "Psalms": 150, "Proverbs": 31, "Ecclesiastes": 12, "Song of Solomon": 8, 
              "Isaiah": 66, "Jeremiah": 52, "Lamentations": 5, "Ezekiel": 48, "Daniel": 12, "Hosea": 14, 
              "Joel": 3, "Amos": 9, "Obadiah": 1, "Jonah": 4, "Micah": 7, "Nahum": 3, "Habakkuk": 3, 
              "Zephaniah": 3, "Haggai": 2, "Zechariah": 14, "Malachi": 4, "Matthew": 28, "Mark": 16, 
              "Luke": 24, "John": 21, "Acts": 28, "Romans": 16, "1 Corinthians": 16, "2 Corinthians": 13, 
              "Galatians": 6, "Ephesians": 6, "Philippians": 4, "Colossians": 4, "1 Thessalonians": 5, 
              "2 Thessalonians": 3, "1 Timothy": 6, "2 Timothy": 4, "Titus": 3, "Philemon": 1, 
              "Hebrews": 13, "James": 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1, 
              "3 John": 1, "Jude": 1, "Revelation": 22
            };
  
            const randomBook = bookNames[Math.floor(Math.random() * bookNames.length)];
            const randomChapter = Math.floor(Math.random() * chapterCounts[randomBook]) + 1;
  
            const redirectUrl = `https://www.biblegateway.com/passage/?search=${randomBook}+${randomChapter}&version=NKJV`;
  
            redirectedTabs[details.tabId] = true;
            chrome.storage.local.set({redirectTimestamp: currentTime, redirectDate: currentDate, redirectedTabs}, function() {
              chrome.tabs.update(details.tabId, {url: redirectUrl});
            });
          }
          
        }
        chrome.runtime.sendMessage({ message: "countdownComplete" });
      });
    }
  });
  
  chrome.runtime.onInstalled.addListener(function() {
    const currentDate = new Date().toISOString().slice(0, 10);
    chrome.storage.local.set({redirectDate: currentDate, redirectTimestamp: null, redirectedTabs: {}, redirectStop: false});
  });
  
  chrome.tabs.onCreated.addListener(function() {
    const currentDate = new Date().toISOString().slice(0, 10);
    chrome.storage.local.set({redirectDate: currentDate, redirectTimestamp: null, redirectedTabs: {}, redirectStop: false});
  });
  