IVYSUDOKU = (function () {
   
   var activeSquare;
   var problemGrid;
   var solutionGrid;
   var userGrid;
   var finished;
   var level = 0;
   
   var loadedData;
   
    function init(_level) {
    console.log("ivy sudoku ready");
    level = _level;
    loadJSON();
    // initProblem();
            }
    function onResize() {
            }
            
            function loadJSON() {
    	console.log("loading JSON...");
	    var xobj = new XMLHttpRequest();
	    xobj.overrideMimeType("application/json");
	    var d = new Date();
	    var m = d.getMonth();
	    var mstring = "0"+(m+1)
	    if (m+1>=10) {
		    mstring = m+1;
	    }
	    var daystring = "0"+d.getDate();
	    if (daystring>=10) {
		    daystring = d.getDate();
	    }
	    var datestring = d.getFullYear()+"-"+mstring+"-"+daystring;
	    
	    xobj.open('GET', "http://sudokukingdom.parseapp.com/boards/"+datestring, true);
	    
	    
	    xobj.onreadystatechange = function () {
	        if (xobj.readyState == 4 && xobj.status == "200") {
	        	// console.log("JSON loaded:");
	            loadedData = JSON.parse(xobj.responseText);
	            // console.log(loadedData);
	            initProblem();
    
	        }
	    }
	    xobj.send(null);
	}
            
            
            function initProblem() {
           console.log(loadedData);
				problemGrid = [];
				solutionGrid = [];
				for (var i = 0; i<9; i++) {
					var rowP = [];
					var rowS = [];
					for (var j = 0; j<9; j++) {
						rowP[j] = parseInt(loadedData[level].Puzzle.charAt(i*9+j));
						rowS[j] = parseInt(loadedData[level].Solution.charAt(i*9+j));
					}
					solutionGrid[i] = rowS;
					problemGrid[i] = rowP;
				}
				console.log(problemGrid);
				/* if (level===0) {
				problemGrid[0] = [0,0,3,9,0,0,0,5,1];
		        problemGrid[1] = [5,4,6,0,1,8,3,0,0];
		        problemGrid[2] = [0,0,0,0,0,7,4,2,0];
		        problemGrid[3] = [0,0,9,0,5,0,0,3,0];
		        problemGrid[4] = [2,0,0,6,0,3,0,0,4];
		        problemGrid[5] = [0,8,0,0,7,0,2,0,0];
		        problemGrid[6] = [0,9,7,3,0,0,0,0,0];
		        problemGrid[7] = [0,0,1,8,2,0,9,4,7];
		        problemGrid[8] = [8,5,0,0,0,4,6,0,0];
				} else if (level===1) {
	        problemGrid[0] = [6,0,0,1,0,8,2,0,3];
	        problemGrid[1] = [0,2,0,0,4,0,0,9,0];
	        problemGrid[2] = [8,0,3,0,0,5,4,0,0];
	        problemGrid[3] = [5,0,4,6,0,7,0,0,9];
	        problemGrid[4] = [0,3,0,0,0,0,0,5,0];
	        problemGrid[5] = [7,0,0,8,0,3,1,0,2];
	        problemGrid[6] = [0,0,1,7,0,0,9,0,6];
	        problemGrid[7] = [0,8,0,0,3,0,0,2,0];
	        problemGrid[8] = [3,0,2,9,0,4,0,0,5];
			}
       
        if (level===0) {
        solutionGrid[0] = [7,2,3,9,4,6,8,5,1];
        solutionGrid[1] = [5,4,6,2,1,8,3,7,9];
        solutionGrid[2] = [9,1,8,5,3,7,4,2,6];
        solutionGrid[3] = [1,6,9,4,5,2,7,3,8];
        solutionGrid[4] = [2,7,5,6,8,3,1,9,4];
        solutionGrid[5] = [3,8,4,1,7,9,2,6,5];
        solutionGrid[6] = [4,9,7,3,6,1,5,8,2];
        solutionGrid[7] = [6,3,1,8,2,5,9,4,7];
        solutionGrid[8] = [8,5,2,7,9,4,6,1,3];
        } else if (level===1) {
        solutionGrid[0] = [6,4,5,1,9,8,2,7,3];
        solutionGrid[1] = [1,2,7,3,4,6,5,9,8];
        solutionGrid[2] = [8,9,3,2,7,5,4,6,1];
        solutionGrid[3] = [5,1,4,6,2,7,3,8,9];
        solutionGrid[4] = [2,3,8,4,1,9,6,5,7];
        solutionGrid[5] = [7,6,9,8,5,3,1,4,2];
        solutionGrid[6] = [4,5,1,7,8,2,9,3,6];
        solutionGrid[7] = [9,8,6,5,3,1,7,2,4];
        solutionGrid[8] = [3,7,2,9,6,4,8,1,5];
        } */
        userGrid = [];
        userGrid[0] = [0,0,0,0,0,0,0,0,0];
        userGrid[1] = [0,0,0,0,0,0,0,0,0];
        userGrid[2] = [0,0,0,0,0,0,0,0,0];
        userGrid[3] = [0,0,0,0,0,0,0,0,0];
        userGrid[4] = [0,0,0,0,0,0,0,0,0];
        userGrid[5] = [0,0,0,0,0,0,0,0,0];
        userGrid[6] = [0,0,0,0,0,0,0,0,0];
        userGrid[7] = [0,0,0,0,0,0,0,0,0];
        userGrid[8] = [0,0,0,0,0,0,0,0,0];
        
        finished = false;
        
        for (var x = 1; x<=9; x++) {
	        for (var y = 1; y<=9; y++) {
	         	if (problemGrid[y-1][x-1]!==0) {
		        	document.getElementById("s_"+x+"_"+y+"_n").innerHTML = problemGrid[y-1][x-1];
		        	 document.getElementById("s_"+x+"_"+y).className = 'square';
		        } else {
			        document.getElementById("s_"+x+"_"+y).className = 'square editable';
			        document.getElementById("s_"+x+"_"+y+"_n").innerHTML = "";
			        document.getElementById("s_"+x+"_"+y+"_1").innerHTML = "";
			        document.getElementById("s_"+x+"_"+y+"_2").innerHTML = "";
			        document.getElementById("s_"+x+"_"+y+"_3").innerHTML = "";
			        document.getElementById("s_"+x+"_"+y+"_4").innerHTML = "";
			        document.getElementById("s_"+x+"_"+y+"_5").innerHTML = "";
			        document.getElementById("s_"+x+"_"+y+"_6").innerHTML = "";
			        document.getElementById("s_"+x+"_"+y+"_7").innerHTML = "";
			        document.getElementById("s_"+x+"_"+y+"_8").innerHTML = "";
			        document.getElementById("s_"+x+"_"+y+"_9").innerHTML = "";
		        }
	        }
        }
        activeSquare = null;
		            clearKeyboard();
		            clearNoteKeyboard();
		            document.getElementById("keyboard").className = 'clearfix inactive';
        instruction("Trykk i ønsket rute for å legge inn et tall!");
    }
            
            
            function squareClick(id) {
            if (!finished) {
	            if (activeSquare) {
		            	activeSquare.className = 'square editable';
		            } else {
			            instruction("Trykk på tallet du vil skal stå i ruten!");
		            }
		        if (!document.getElementById(id)) {
		        console.log("Error: squareClick - no element with id "+id);
			        return;
		        }
		        document.getElementById("keyboard").className = 'clearfix';
	            if (document.getElementById(id).className === 'square') {
		            // Non-editable
		            activeSquare = null;
		            clearKeyboard();
		            clearNoteKeyboard();
		            document.getElementById("keyboard").className = 'clearfix inactive';
		            instruction("Trykk i ønsket rute for å legge inn et tall!");
		            return;
	            }
		            console.log(id);
		            
		            activeSquare = document.getElementById(id);
		            activeSquare.className = 'square active editable';
		            clearKeyboard();
		            if (document.getElementById(activeSquare.id+"_n").innerHTML!=="") {
		            	instruction("Trykk på et tall for å endre, eller trykk på en annen rute for å fortsette!");
			            document.getElementById("k_s_"+document.getElementById(activeSquare.id+"_n").innerHTML).className = 'square active editable';
		            } else {
			            var haveNotes = false;
			            for (var i=1; i<=9; i++) {
				            if (document.getElementById(activeSquare.id+"_"+i).innerHTML === "") {
				            } else {
					            haveNotes = true;
				            }
						}
						if (haveNotes) {
							instruction("Legg til flere notater, eller trykk på tallet du vil skal stå i ruten!");
						} else {
							instruction("Trykk på tallet du vil skal stå i ruten!");
						}
			            
		            }
		            clearNoteKeyboard();
		            for (var i = 1; i<=9; i++) {
			            if (document.getElementById(activeSquare.id+"_"+i).innerHTML!=="") {
				            document.getElementById("k_n_"+document.getElementById(activeSquare.id+"_"+i).innerHTML).className = 'square active editable';
			            }
		            }
	            }
	            
            }
            function clearSquare() {
	            if (activeSquare && !finished) {
	            	clearKeyboard();
	            	clearNoteKeyboard();
	            	document.getElementById(activeSquare.id+"_n").innerHTML="";
	            	setUserGrid(activeSquare.id,0);
	            	clearSquareNotes();
	            }
            }
            function clearSquareNotes() {
	            if (activeSquare) {
		            for (var i = 1; i<=9; i++) {
		            	document.getElementById(activeSquare.id+"_"+i).innerHTML="";
		            }
	            }
	            // document.getElementById(activeSquare.id).innerHTML= "<div id='s_"+activeSquare.id+"_n' class='square_number'></div>";
            }
            function keyboardClick(number) {
            if (!finished) {
            	clearKeyboard();
            	clearNoteKeyboard();
            	clearSquareNotes();
            	if (!activeSquare) {
            		return;
            	}
            	
            	if (document.getElementById(activeSquare.id+"_n").innerHTML!=number) {
		            document.getElementById("k_s_"+number).className = 'square active';
		            instruction("Trykk på en ny rute, eller trykk på et annet tall for å endre!");
		            if (activeSquare) {
			            document.getElementById(activeSquare.id+"_n").innerHTML = number;
			            setUserGrid(activeSquare.id,number);
		            }
		            
		         } else {
			            document.getElementById("k_s_"+number).className = 'square';
			            clearSquare();
		          }
	            	   }         
            }
            function errors() {
            	var errorCount = 0;
	            for (var x = 0; x<9; x++) {
			        for (var y = 0; y<9; y++) {
			         	if (problemGrid[y][x]===0) {
				        	if (userGrid[y][x]===solutionGrid[y][x]) {
					        	
				        	} else {
					        	errorCount +=1;
				        	}
				        }
			        }
				}
				return errorCount;
      	     }
      	     function squaresLeft() {
	      	     var leftCount = 0;
	      	     for (var x = 0; x<9; x++) {
			        for (var y = 0; y<9; y++) {
			         	if (problemGrid[y][x]===0) {
				        	if (userGrid[y][x]===0 || userGrid[y][x] instanceof Array) {
					        	leftCount +=1;
				        	}
				        }
			        }
				}
	      	     return leftCount;
      	     }
            function setUserGrid(activeSquareId,value) {
            	var koo = activeSquareId.split("_");
            	var x = koo[1]-1;
            	var y = koo[2]-1;
	            userGrid[y][x]=value;
	           //  console.log(userGrid.toString());
	           var errs = errors();
	           console.log("Errors: "+errs);
	           if (errs===0) {
		           victory();
	           } else {
		           if (squaresLeft()===0) {
			           instruction("Du har fylt ut alle rutene, men besvarelesen inneholder feil!");
		           }
	           }
            }
            function victory() {
	            console.log("Victory!");
	            instruction("Gratulerer! Du har løst oppgaven!");
	            clearKeyboard();
	            clearNoteKeyboard();
	            document.getElementById("keyboard").className = 'clearfix inactive';
	            finished = true;
	            for (var x = 1; x<=9; x++) {
			        for (var y = 1; y<=9; y++) {
			         	if (problemGrid[y-1][x-1]===0) {
					        document.getElementById("s_"+x+"_"+y).className = 'square victory';
				        }
					}
				}
            }
            
            function getUserGrid(activeSquareId) {
            	var koo = activeSquareId.split("_");
            	var x = koo[1]-1;
            	var y = koo[2]-1;
	            return userGrid[y][x]=value;
            }
            
            function keyboardNoteClick(number) {
            	if (activeSquare && !finished) {
            		clearKeyboard();
		            document.getElementById(activeSquare.id+"_n").innerHTML = "";
		            if (document.getElementById(activeSquare.id+"_"+number).innerHTML==="") {
		            	document.getElementById(activeSquare.id+"_"+number).innerHTML = number;
		            	instruction("De små tallene er dine notater. Noter så mange tall du vil, og bytt dem med et stort når du er sikker!");
		            } else {
		            	document.getElementById(activeSquare.id+"_"+number).innerHTML = "";
		            }	            
	            	if (document.getElementById("k_n_"+number).className==='square') {
		           		document.getElementById("k_n_"+number).className = 'square active';
		            } else {
			           document.getElementById("k_n_"+number).className = 'square'; 
		            }
		            var noteArray = [0,0,0,0,0,0,0,0,0];
		            var haveNotes = false;
		            for (var i=1; i<=9; i++) {
			            if (document.getElementById(activeSquare.id+"_"+i).innerHTML === "") {
				            noteArray[i-1] = 0;
			            } else {
				            noteArray[i-1] = i;
				            haveNotes = true;
			            }
					}
					if (haveNotes) {
						setUserGrid(activeSquare.id,noteArray);
					} else {
						setUserGrid(activeSquare.id, 0);
					}
	            }
	            
            }
            function clearKeyboard() {
	            for (var i=1; i<=9; i++) {
	            	document.getElementById("k_s_"+i).className = 'square';
            	}
            }
            function instruction(txt) {
	            document.getElementById("instruction").innerHTML = txt;
            }
            function clearNoteKeyboard() {
	           for (var i=1; i<=9; i++) {
	            	document.getElementById("k_n_"+i).className = 'square';
            	}
            }
            function menuClick() {
	            document.getElementById("main_menu").className = 'active';
            }
            function restart() {
           		menuClose();
	            init(level);
            }
            function menuClose() {
	            document.getElementById("main_menu").className = '';
            }
            function cheat(n) {
	            for (var x = 0; x<9; x++) {
			        for (var y = 0; y<9; y++) {
			         	
			         	if (userGrid[y][x]===0 && problemGrid[y][x]===0) {
				        	if (n>0) {
					        	userGrid[y][x]=solutionGrid[y][x];
					        	squareClick("s_"+(x+1)+"_"+(y+1));
					        	keyboardClick(userGrid[y][x]);
								n -=1;
				        	}
				        }
			        }
				}
            }
    
    return {
        init:init,
        squareClick:squareClick,
        keyboardClick:keyboardClick,
        keyboardNoteClick:keyboardNoteClick,
        clearSquare:clearSquare,
        onResize: onResize,
        menuClick: menuClick,
        menuClose: menuClose,
		restart: restart,
        cheat: cheat
    };
})();

window.onresize = function () {
    IVYSUDOKU.onResize();
}


var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        IVYSUDOKU.init(0);
    }
}, 10);