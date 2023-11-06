var genBtn=document.getElementById('generateBtn');
var resBtn=document.getElementById('resetBtn');
var field=document.getElementsByClassName('field')[0];
const fArr=new Array();
let x=0, y=0;
const field_size=600;
var mines_num=0;

genBtn.addEventListener('click', generate_field);
resBtn.addEventListener('click', reset_field);
field.addEventListener('click', (e)=>{
            let target_el=e.target;
        if(target_el.firstChild===null){
            let value=JSON.parse(target_el.id);
            let i=value["i"], j=value["j"];
            open_el(i,j, value["value"]);
            if(value["value"]=='*')
                {
                    for (let i = 0; i < x; ++i) 
                    for (let j = 0; j < y; ++j) 
                        open_el(i,j);
                    alert('You lose');
            }
            if(value["value"]==0){
                open_around_zero(i,j);
                open_around_zero.finish();
            }
        }
});

field.addEventListener('contextmenu', (e)=>{
    e.preventDefault();
    let target_el=e.target;
    if(target_el.style.backgroundColor!="aqua"){
        if(target_el.id!=""){
            let img=document.createElement('img');
            target_el.style.backgroundColor="aqua";
            img.style.width=String(field_size/x)+"px";
            img.style.height=String(field_size/x)+"px";
            img.src="flag.png";
            target_el.appendChild(img);
            if(JSON.parse(target_el.id)["value"]=="*")--mines_num;
            if(mines_num==0){ 
                for (let i = 0; i < x; ++i) 
                for (let j = 0; j < y; ++j) 
                    open_el(i,j);
                 alert("You win");
                }
        }
        else {            
            let parent=target_el.parentNode;
            parent.style.backgroundColor="gray";
            parent.removeChild(parent.firstChild);
            if(JSON.parse(target_el.id)["value"]=="*")++mines_num;
        }
    }
});



function generate_field()
{
    
    x=parseInt(document.querySelectorAll('input')[0].value);
    y=parseInt(document.querySelectorAll('input')[1].value);
    if(!isNaN(x)){
        //if(!isNaN(y)){y=x;}
    hide_useless();
    field.style.display="block";
    field.style.width=String(field_size)+"px";
    field.style.height=String(field_size)+"px";
    for(let i=0; i<x; ++i){
        fArr[i]=new Array();
        let row=document.createElement('div');
        row.className='row';
        for(let j=0; j<y; ++j){
            let elem=document.createElement('div');
            elem.className='element';
            elem.style.width=String(field_size/y)+"px";
            elem.style.height=String(field_size/x)+"px";
            elem.style.fontSize=String(Math.floor(field_size/x/4))+"pt";
            
            let obj={}; obj.value=0; obj.i=i; obj.j=j;
            if(Math.floor(Math.random()*20)==0){obj.value="*";++mines_num;}
            elem.id=JSON.stringify(obj);

            row.appendChild(elem);
            fArr[i][j]=elem;
        }
        field.appendChild(row);
    }
    for (let i = 0; i < x; ++i) {
        for (let j = 0; j < y; ++j) {
           let counter=0;
            if(JSON.parse(fArr[i][j].id)["value"]!="*"){
                let obj=JSON.parse(fArr[i][j].id);
                if((i-1>=0)&&(j-1>=0)&&JSON.parse(fArr[i-1][j-1].id)["value"]=="*")counter++;
                if((j-1>=0)&&JSON.parse(fArr[i][j-1].id)["value"]=="*")counter++;
                if((i-1>=0)&&JSON.parse(fArr[i-1][j].id)["value"]=="*")counter++;
                if((i+1<x)&&(j+1<y)&&JSON.parse(fArr[i+1][j+1].id)["value"]=="*")counter++;
                if((i+1<x)&&JSON.parse(fArr[i+1][j].id)["value"]=="*")counter++;
                if((j+1<y)&&JSON.parse(fArr[i][j+1].id)["value"]=="*")counter++;
                if((i-1>=0)&&(j+1<y)&&JSON.parse(fArr[i-1][j+1].id)["value"]=="*")counter++;
                if((i+1<x)&&(j-1>=0)&&JSON.parse(fArr[i+1][j-1].id)["value"]=="*")counter++;
                obj["value"]=counter;
                fArr[i][j].id=JSON.stringify(obj);
        }
        }  
    }}
    else{ alert("Введите нормальное число");}
}

function reset_field(){
    while (field.childElementCount!=0) {
        field.removeChild(field.firstChild);
    }
    field.style.display="none";
    genBtn.style.display="";
    document.querySelectorAll('input')[0].style.display="";
}

function hide_useless(){
genBtn.style.display="none";
document.querySelectorAll('input')[0].style.display="none";
document.querySelectorAll('input')[1].style.display="none";
}
function open_el(i, j){
    if (i>=0&&i<x&&j>=0&&j<y&&fArr[i][j].style.backgroundColor!="aqua") {
        fArr[i][j].style.backgroundColor="aqua";
        let value= JSON.parse(fArr[i][j].id)["value"];
        if(value!=0&&value!='*'){fArr[i][j].innerHTML=String(value);
        }
       
        if(value=='*'){
            let img=document.createElement('img');
            img.style.width=String(field_size/x)+"px";
            img.style.height=String(field_size/x)+"px";
            img.src="bomb.png";
            fArr[i][j].appendChild(img);
        }
    }
}

open_around_zero.finish=function(){
    for (let i = 0; i < x; ++i)
        for (let j = 0; j < y; ++j) 
            if (JSON.parse(fArr[i][j].id)["value"] == 0&&fArr[i][j].style.backgroundColor=="aqua")
                for (let i_ = -1; i_ < 2; ++i_) 
                    for (let  j_= -1; j_ < 2; ++j_) 
                        open_el(i+i_, j+j_);             
}
function open_around_zero(i,j){    
    fArr[i][j].style.backgroundColor="aqua";
    for (let i_ = Math.max(0, i - 1); i_ < Math.min(i + 2, x); ++i_)
    for (let j_ = Math.max(0, j - 1); j_ < Math.min(j + 2, y); ++j_) 
        if (i_ != i || j_ != j) {
        if (JSON.parse(fArr[i_][j_].id)["value"] == 0)
        if (fArr[i_][j_].style.backgroundColor!="aqua")open_around_zero(i_, j_);
        else open_el(i_, j_);
    }
}
