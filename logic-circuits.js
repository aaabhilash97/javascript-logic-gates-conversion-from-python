Array.prototype.insert=function(index,item){
                                                                                        this.splice(index,0,item);
                                };
function connector(owner,name,activates,monitor){
	this.value=NaN;
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
function lc(name){
	this.name=name;
	this.evaluate=function(){return;};
}
not.prototype=new lc();
not.prototype.constructor=not;
function not(name){
//	lc.__proto__(
	this.name=name;
	this.a;
	this.b;
	this.setpins=function(gate){
		this.a=new connector(gate,'not in',1,0);
		this.b=new connector(gate,'not out',0,0);
		this.a.activates=1;
	};
	this.evaluate=function(){
		if (this.a.value==1) var a=0;
		else if(this.a.value==0) var a=1;
		this.b.set(a);
	};
}
function and(name){
	this.name=name;
	this.a;
	this.b;
	this.c;
	this.setpins=function(gate){
		this.a=new connector(gate,'and a',1,0);
		this.b=new connector(gate,'and b',1,1);
		this.c=new connector(gate,'and c',0,1);
		this.a.activates=1;
		this.b.activates=1;
	};
	this.evaluate=function(){
		this.c.set(this.a.value&&this.b.value);
	};
}
function or(name){
        this.name=name;
        this.a;
        this.b;
        this.c;
        this.setpins=function(gate){
                this.a=new connector(gate,'and a',1,0);
                this.b=new connector(gate,'and b',1,1);
                this.c=new connector(gate,'and c',0,1);
                this.a.activates=1;
                this.b.activates=1;
        };
        this.evaluate=function(){
                this.c.set(this.a.value || this.b.value);
        };
}
function nand(name){
	this.name=name;
	this.a;
	this.b;
	this.c;
	this.and1;
	this.not1;
	this.setpins=function(gate){
		this.a=new connector(gate,'a',1,0);
		this.b=new connector(gate,'b',1,0);
		this.c=new connector(gate,'c',1,0);
		this.and1=new and("and1");
		this.not1=new not("not1");
		this.and1.setpins(this.and1);
		this.not1.setpins(this.not1);
		this.a.connect([this.and1.a]);
		this.b.connect([this.and1.b]);
		this.and1.c.connect([this.not1.a]);
		this.not1.b.connect([this.c]);
	};
}
function xor(name){
        this.name=name;
        this.a;this.b;this.c;this.and1;this.and2;this.not1;this.not1;this.or1;
        this.setpins=function(gate){
                this.a=new connector(gate,'a',1,0);
                this.b=new connector(gate,'b',1,0);
                this.c=new connector(gate,'c',1,0);
                this.and1=new and("and1");this.and2=new and("and2");
                this.not1=new not("not1");this.not2=new not("not2");
		this.or1=new or("or1");
                this.and1.setpins(this.and1);this.and2.setpins(this.and2);
                this.not1.setpins(this.not1);this.not2.setpins(this.not2);
		this.or1.setpins(this.or1);
		this.a.connect([this.and1.a,this.not1.a]);
		this.b.connect([this.and2.b,this.not2.a]);
		this.not1.b.connect([this.and2.a]);
		this.not2.b.connect([this.and1.b]);
		this.and1.c.connect([this.or1.a]);
		this.and2.c.connect([this.or1.b]);
		this.or1.c.connect([this.c]);
        };
}
function ha(name){
	this.name=name;
	this.a;this.b;this.c;this.s;this.xor1;this.and1;
	this.setpins=function(gate){
		this.a=new connector(gate,'a',1,0);
                this.b=new connector(gate,'b',1,0);
                this.c=new connector(gate,'c',1,0);
		this.s=new connector(gate,'s',1,0);
		this.xor1=new xor('xor1');
		this.and1=new and('and1');
		this.xor1.setpins(this.xor1);
		this.and1.setpins(this.and1);
		this.a.connect([this.xor1.a,this.and1.a]);
		this.b.connect([this.xor1.b,this.and1.b]);
		this.xor1.c.connect([this.s]);
		this.and1.c.connect([this.c]);
	};
}
var nand1=new ha('nand');
nand1.setpins(nand1);
nand1.c.monitor=1;
nand1.s.monitor=1;
nand1.a.set(0);
nand1.b.set(0);

/*var and1=new and('a1');
and1.setpins(and1);
var n = new not('N1');
n.setpins(n);
and1.c.connect([n.a]);
and1.c.monitor=1;
n.b.monitor=1;
and1.a.set(1)
and1.b.set(1);
console.log(n.b.value);*/
