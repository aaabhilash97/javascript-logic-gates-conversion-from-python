Array.prototype.insert=function(index,item){
		this.splice(index,0,item);
};
function connector(owner,name,activates,monitor){
	this.value=undefined;
	this.owner=owner;
	this.name=name;
	this.monitor=monitor=0;
	this.connects=[];
	this.activates=activates=0;
	this.connect=function(inputs) {
		for (var k=0;k<inputs.length;k++){
				this.connects.insert(this.connects.length,inputs[k]);}
	};
	this.set=function(value){
		if (this.value == value){
			return;
		};
		this.value=value;
		if(this.activates){
			this.owner.evaluate();
		};
		if (this.monitor&&(this.value==1||this.value==0)){
			console.log("connector "+this.owner.name + "-"+this.name+" set to " + this.value);};
		for (var i=0;i<this.connects.length;i++){
			this.connects[i].set(value);}
	};
}
function not(name){
	this.name=name;
	this.a=new connector(this,'not in',1,0);
	this.b=new connector(this,'not out',0,0);
	this.a.activates=1;
	this.evaluate=function(){
		this.b.set(!this.a.value?1:0);
	};
}
function and(name){
	this.name=name;
		this.a=new connector(this,'and a',1,0);
		this.b=new connector(this,'and b',1,1);
		this.c=new connector(this,'and c',0,1);
		this.a.activates=1;
		this.b.activates=1;
	this.evaluate=function(){
		this.c.set(this.a.value&&this.b.value);
	};
}
function or(name){
        this.name=name;
                this.a=new connector(this,'and a',1,0);
                this.b=new connector(this,'and b',1,1);
                this.c=new connector(this,'and c',0,1);
                this.a.activates=1;
                this.b.activates=1;
        this.evaluate=function(){
                this.c.set(this.a.value || this.b.value);
        };
}
function nand(name){
	this.name=name;
		this.a=new connector(this,'a',1,0);
		this.b=new connector(this,'b',1,1);
		this.c=new connector(this,'c',0,1);
		this.a.activates=1;
		this.b.activates=1;
	this.evaluate=function(){
		this.c.set(!(this.a.value&&this.b.value)?1:0);
	};
}
function xor(name){
        this.name=name;
                this.a=new connector(this,'a',1,0);
                this.b=new connector(this,'b',1,0);
                this.c=new connector(this,'c',1,0);
                this.and1=new and("and1");this.and2=new and("and2");
                this.not1=new not("not1");this.not2=new not("not2");
		this.or1=new or("or1");
		this.a.connect([this.and1.a,this.not1.a]);
		this.b.connect([this.and2.b,this.not2.a]);
		this.not1.b.connect([this.and2.a]);
		this.not2.b.connect([this.and1.b]);
		this.and1.c.connect([this.or1.a]);
		this.and2.c.connect([this.or1.b]);
		this.or1.c.connect([this.c]);
}
function ha(name){
	this.name=name;
		this.a=new connector(this,'a',1,0);
                this.b=new connector(this,'b',1,0);
                this.c=new connector(this,'c',1,0);
		this.s=new connector(this,'s',1,0);
		this.xor1=new xor('xor1');
		this.and1=new and('and1');
		this.a.connect([this.xor1.a,this.and1.a]);
		this.b.connect([this.xor1.b,this.and1.b]);
		this.xor1.c.connect([this.s]);
		this.and1.c.connect([this.c]);
}
function fa(name){
	this.name=name;
		this.a=new connector(this,'a',1,0);
                this.b=new connector(this,'b',1,0);
                this.c=new connector(this,'c',1,0);
                this.s=new connector(this,'s',1,0);
		this.cin=new connector(this,'cin',1,0);
		this.ha1=new ha('ha1');this.ha2=new ha('ha1');
		this.or1=new or('or1');
		this.cin.connect([this.ha1.a]);
		this.ha1.s.connect([this.s]);
		this.a.connect([this.ha2.a]);
		this.ha2.s.connect([this.ha1.b]);
		this.ha1.c.connect([this.or1.a]);
		this.or1.c.connect([this.c]);
		this.b.connect([this.ha2.b]);
		this.ha2.c.connect([this.or1.b]);
}
function latch(name){
	this.name=name;
		this.a=new connector(this,'a',1,0);
                this.b=new connector(this,'b',1,0);
                this.q=new connector(this,'q',0,1);
		this.nand1=new nand('nand1');
		this.nand2=new nand('nand2');		
		this.a.connect([this.nand1.a]);
		this.b.connect([this.nand2.b]);
		this.nand1.c.connect([this.nand2.a]);
		this.nand2.c.connect([this.nand1.b]);
		this.nand1.c.connect([this.q]);
	this.testlatch=function(){
		this.q.monitor=1;
		this.a.set(1);this.b.set(1);
		console.log("\n");
		this.a.set(0);this.a.set(1);
		this.a.set(0);this.a.set(1);
		this.b.set(0);this.b.set(1);
		console.log("\n");
		this.a.set(0);this.a.set(1);
	};
}
//var l1=new latch('l1');
//l1.testlatch()
function dff(name){
		this.name=name;
		this.d=new connector(this,'d',1,0);
		this.c=new connector(this,'c',1,0);
		this.q=new connector(this,'d',0,0);
		this.d.activates=1;this.c.activates=1;
		this.q.value=0;
		this.prev=undefined;
		this.evaluate=function(){
			if(this.c.value==0&&this.prev==1)
				this.q.set(this.d.value);
			this.prev=this.c.value;
		};
}
function div2(name){
		this.name=name;
		this.c=new connector(this,'c',1);
		this.d=new connector(this,'d');
		this.q=new connector(this,'q',0,1);
		this.q.value=0;this.q.monitor=1;
		this.dff1=new dff('dff1');
		this.not1=new not('not1');
		this.c.connect([this.dff1.c]);
		this.d.connect([this.dff1.d]);
		this.dff1.q.connect([this.not1.a,this.q]);
		this.not1.b.connect([this.dff1.d]);
		this.dff1.q.activates=1;
		this.dff1.d.value=1-this.dff1.q.value;
}
function testDivBy2(){
	var x = new div2("X");
	var c = 0;
	x.c.set(c);

	var i = 10;
	while(i--){
		 console.log("Clock is",c);
		 c = !c ? 1 : 0;
		 x.c.set(c);
	}
}
function counter(name){
	  this.B0 = new div2('B0');
	  this.B1 = new div2('B1');
	  this.B2 = new div2('B2');
	  this.B3 = new div2('B3');
	  this.B0.q.connect( this.B1.c );
	  this.B1.q.connect( this.B2.c );
	  this.B2.q.connect( this.B3.c );
}
function testcounter(){
	var x = new counter("x");	/*  x is a four bit counter */
	x.B0.c.set(1);			/* set the clock line 1 */

	var i = 10;
	while(i--){
		console.log("Count is ", x.B3.q.value, x.B2.q.value, x.B1.q.value, x.B0.q.value);
		x.B0.c.set(0);		/*  toggle the clock */
		x.B0.c.set(1);
	}
}
testcounter()
