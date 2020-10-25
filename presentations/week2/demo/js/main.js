(()=>{"use strict";const t={id:"gameCanvas",canvas:null,context:null},e={images:[{id:"player",src:"./images/julhilde.png"},{id:"broomEnemy",src:"./images/broom-enemy.png"},{id:"floorTile",src:"./images/tiles/dungeon-floor.png"},{id:"fence_b_a",src:"./images/tiles/fence_b_a.png"},{id:"fence_b_b",src:"./images/tiles/fence_b_b.png"},{id:"fence_bll",src:"./images/tiles/fence_bll.png"},{id:"fence_blu",src:"./images/tiles/fence_blu.png"},{id:"fence_brl",src:"./images/tiles/fence_brl.png"},{id:"fence_bru",src:"./images/tiles/fence_bru.png"},{id:"fence_l",src:"./images/tiles/fence_l.png"},{id:"fence_r",src:"./images/tiles/fence_r.png"},{id:"fence_t_a",src:"./images/tiles/fence_t_a.png"},{id:"fence_t_b",src:"./images/tiles/fence_t_b.png"},{id:"fence_tll",src:"./images/tiles/fence_tll.png"},{id:"fence_tlu",src:"./images/tiles/fence_tlu.png"},{id:"fence_trl",src:"./images/tiles/fence_trl.png"},{id:"fence_tru",src:"./images/tiles/fence_tru.png"},{id:"fence_gate_ll",src:"./images/tiles/fence_gate_ll.png"},{id:"fence_gate_lu",src:"./images/tiles/fence_gate_lu.png"},{id:"fence_gate_rl",src:"./images/tiles/fence_gate_rl.png"},{id:"fence_gate_ru",src:"./images/tiles/fence_gate_ru.png"},{id:"fence_gate_tl",src:"./images/tiles/fence_gate_tl.png"},{id:"fence_gate_tr",src:"./images/tiles/fence_gate_tr.png"},{id:"higrass_a",src:"./images/tiles/higrass_a.png"},{id:"higrass_b",src:"./images/tiles/higrass_b.png"},{id:"higrass_c",src:"./images/tiles/higrass_c.png"},{id:"higrass_d",src:"./images/tiles/higrass_d.png"},{id:"lograss_a",src:"./images/tiles/lograss_a.png"},{id:"lograss_b",src:"./images/tiles/lograss_b.png"},{id:"lograss_c",src:"./images/tiles/lograss_c.png"},{id:"lograss_d",src:"./images/tiles/lograss_d.png"},{id:"paver_a",src:"./images/tiles/paver_a.png"},{id:"paver_b",src:"./images/tiles/paver_b.png"},{id:"paver_c",src:"./images/tiles/paver_c.png"},{id:"paver_d",src:"./images/tiles/paver_d.png"},{id:"lawnmower",src:"./images/lawnmower.png"}],sounds:[{id:"shoot",src:"./sounds/shoot"}]},s="probably"==(new Audio).canPlayType("audio/mp3")?"mp3":"ogg";class i{constructor(t,e){this.filePath=t,this.soundIndex=0,this.sounds=[this.getAudio(),this.getAudio()],this.sounds[this.soundIndex].addEventListener("canplay",e)}getAudio(t){return new Audio(`${this.filePath}.${s}`)}play(){this.sounds[this.soundIndex].paused||this.sounds.splice(this.soundIndex,0,this.getAudio()),this.sounds[this.soundIndex].currentTime=0,this.sounds[this.soundIndex].play(),this.soundIndex=++this.soundIndex%this.sounds.length}}const n=new class{constructor(){this.assets={images:{},sounds:{}},this.assetDefs=[];for(const[t,s]of Object.entries(e))for(const e of s)e.type=t,this.assetDefs.push(e)}loadAssets(){return Promise.all(this.assetDefs.map((t=>new Promise(((e,s)=>{if("images"==t.type){const i=new Image;i.onload=()=>e({id:t.id,asset:i,type:t.type}),i.onerror=()=>s(i),i.src=t.src}else if("sounds"==t.type){const s=new i(t.src,(()=>e({id:t.id,asset:s,type:t.type})))}}))))).then((t=>{t.forEach((t=>{this.assets[t.type][t.id]=t.asset})),Object.freeze(this.assets)}))}getImage(t){return this.assets.images[t]}getSound(t){return this.assets.sounds[t]}},o=.2;class a{constructor(){this.player=null,this.reset()}update(t){this.previousState=Object.assign({},this.currentState)}reset(){this.currentState={};for(const t of c)this.currentState[t]=!1;this.previousState=Object.assign({},this.currentState)}}const h=["F12"];class r extends a{constructor(){super(),this.name="Keyboard & Mouse",this.mouseButtonHeld=!1,this.mousePos={x:null,y:null},document.addEventListener("keydown",(t=>{t.defaultPrevented||(h.includes(t.code)||t.preventDefault(),this.flipState(t.code,!0))})),document.addEventListener("keyup",(t=>{t.defaultPrevented||(t.preventDefault(),this.flipState(t.code,!1))})),t.canvas.addEventListener("mousemove",(t=>{this.updateMousePos(t)})),t.canvas.addEventListener("mousedown",(t=>{this.mouseButtonHeld=!0})),t.canvas.addEventListener("mouseup",(t=>{this.mouseButtonHeld=!1}))}updateMousePos(t){const e=t.target.getBoundingClientRect(),s=t.target.width/e.width,i=t.target.height/e.height,n=document.documentElement;this.mousePos.x=s*(t.clientX-e.left-n.scrollLeft),this.mousePos.y=i*(t.clientY-e.top-n.scrollTop)}flipState(t,e){switch(t){case"ArrowUp":case"KeyW":this.currentState.up=e;break;case"ArrowDown":case"KeyS":this.currentState.down=e;break;case"ArrowLeft":case"KeyA":this.currentState.left=e;break;case"ArrowRight":case"KeyD":this.currentState.right=e;break;case"KeyC":this.currentState.credits=e;break;case"KeyP":this.currentState.pause=e;break;case"KeyM":this.currentState.mute=e;break;case"Enter":this.currentState.start=e;break;case"Space":this.currentState.dash=e;break;case"KeyQ":this.currentState.debug=e}}update(t){super.update(t),this.mouseButtonHeld?null!=this.player&&(Math.round(this.player.x+this.player.width/2),Math.round(this.player.y+this.player.height/2),this.currentState.shootLeft=this.mousePos.x<this.player.pos.x-1,this.currentState.shootRight=this.mousePos.x>this.player.pos.x+this.player.width+1,this.currentState.shootUp=this.mousePos.y<this.player.pos.y-1,this.currentState.shootDown=this.mousePos.y>this.player.pos.y+this.player.height+1):(this.currentState.shootLeft=!1,this.currentState.shootRight=!1,this.currentState.shootUp=!1,this.currentState.shootDown=!1)}}class l extends a{constructor(t){super(),this.gamepad=t,this.name="Gamepad "+t.index,this.pressedButtons=new Set,this.heldButtons=new Set,this.releasedButtons=new Set,console.log("%s - CONNECTED %s",window.performance&&window.performance.now?window.performance.now():(new Date).getTime(),t)}update(t){const e=navigator.getGamepads?navigator.getGamepads():navigator.webkitGetGamepads?navigator.webkitGetGamepads():[];for(const t of e)if(t.index===this.gamepad.index){this.gamepad=t;break}super.update(t),this.pressedButtons.clear(),this.releasedButtons.clear(),this.gamepad.buttons.forEach(((t,e)=>{1==t||"object"==typeof t&&t.pressed?(this.heldButtons.has(e)||this.pressedButtons.add(e),this.heldButtons.add(e)):(this.heldButtons.has(e)&&this.releasedButtons.add(e),this.heldButtons.delete(e))})),this.gamepad.axes.length>=2&&(this.currentState.left=this.gamepad.axes[0]<-.2||this.heldButtons.has(14),this.currentState.right=this.gamepad.axes[0]>o||this.heldButtons.has(15),this.currentState.up=this.gamepad.axes[1]<-.2||this.heldButtons.has(12),this.currentState.down=this.gamepad.axes[1]>o||this.heldButtons.has(13)),this.gamepad.axes.length>=4&&(this.currentState.shootLeft=this.gamepad.axes[2]<-.2||this.heldButtons.has(2),this.currentState.shootRight=this.gamepad.axes[2]>o||this.heldButtons.has(1),this.currentState.shootUp=this.gamepad.axes[3]<-.2||this.heldButtons.has(3),this.currentState.shootDown=this.gamepad.axes[3]>o||this.heldButtons.has(0)),this.currentState.start=this.pressedButtons.has(9),this.currentState.dash=this.heldButtons.has(4)}}const c=["start","pause","mute","credits","debug","left","right","up","down","left","right","shootUp","shootDown","shootLeft","shootRight","dash","gamepadConnected","gamepadDisconnected"],d=new class{constructor(){this.listeners={};for(const t of c)this.listeners[t]=[];this.controls={},this.defaultControl=null,this.primaryControl=null}initialize(){this.controls.keyboardAndMouse=new r,this.defaultControl=this.controls.keyboardAndMouse,window.addEventListener("gamepadconnected",(t=>{const e="gamepad"+t.gamepad.index;if(void 0===this.controls[e]){this.controls[e]=new l(t.gamepad);for(const t of this.listeners.gamepadConnected)t(this.controls[e])}})),window.addEventListener("gamepaddisconnected",(t=>{const e="gamepad"+t.gamepad.index;if(void 0!==this.controls[e]){this.controls[e]=new l(t.gamepad);for(const t of this.listeners.gamepadDisconnected)t(this.controls[e]);delete this.controls[e]}}))}reset(){for(const t in this.listeners)this.listeners[t]=[];this.on(["start","gamepadConnected"],(t=>{null===this.primaryControl&&(this.primaryControl=t)})),this.on("debug",(t=>{window.debugMode=!window.debugMode,console.log("Debug mode %s",window.debugMode?"enabled":"disabled")}));for(const t of Object.values(this.controls))t.reset();this.on("mute",(t=>{window.mute=!window.mute}))}on(t,e){("string"==typeof t||t instanceof String)&&(t=[t]);for(const s of t)this.listeners[s].push(e)}update(t){for(const e of Object.values(this.controls)){for(const[t,s]of Object.entries(e.currentState))if(s&&!e.previousState[t])for(const s of this.listeners[t])s(e);e.update(t)}}},u=new class{constructor(){this.liveEntities=new Set,this.deadEntities=new Set,this.collisionListeners={}}add(t){console.log("Add live entity",t),this.liveEntities.add(t)}kill(t){this.deadEntities.add(t),this.liveEntities.delete(t)}onCollision(t,e,s){void 0===this.collisionListeners[t+e]?this.collisionListeners[t+e]=[s]:this.collisionListeners[t+e].push(s)}update(t){for(const e of this.liveEntities)e.update(t);for(const t of this.liveEntities)for(const e of this.liveEntities)if(t!==e&&t.canCollideWithTypes.has(e.type)&&t.collider.x<e.collider.x+e.collider.width&&t.collider.x+t.collider.width>e.collider.x&&t.collider.y<e.collider.y+e.collider.height&&t.collider.y+t.collider.height>e.collider.y){const s=this.collisionListeners[t.type+e.type];if(void 0!==s)for(const i of s)t.alive&&e.alive&&i(t,e)}}spawn(t,...e){const s=[...this.deadEntities].filter((e=>e instanceof t));let i;return s.length?(i=s[0],this.deadEntities.delete(i),i.reset(...e)):i=new t(...e),i.alive=!0,this.add(i),i}draw(){for(const t of this.liveEntities)t.draw()}};class p{constructor(t,e,s,i,n,o=10,a=1,h={},r=""){this.pos=Object.assign({},e),this.width=s,this.height=i,this.type=t,this.collider=Object.assign({x:0,y:0,offsetX:0,offsetY:0},n),this.canCollideWithTypes=new Set,this.hp=o,this.damage=a,this.alive=!1,this.animations=h,this.currentAnimation=this.animations[r]||null,this.currentAnimation&&this.currentAnimation.play()}die(){this.alive=!1,u.kill(this)}hurt(t){this.hp-=t,this.hp<=0&&this.die()}reset(t,e){this.pos.x=t,this.pos.y=e}onTopWallCollision(t){}onLeftWallCollision(t){}onBottomWallCollision(t){}onRightWallCollision(t){}update(e){this.pos.x<0&&(this.pos.x=0,this.onLeftWallCollision(e)),this.pos.y<0&&(this.pos.y=0,this.onTopWallCollision(e)),this.pos.x>t.canvas.width-this.width&&(this.pos.x=t.canvas.width-this.width,this.onRightWallCollision(e)),this.pos.y>t.canvas.height-this.height&&(this.pos.y=t.canvas.height-this.height,this.onBottomWallCollision(e)),this.collider.x=this.pos.x+(this.width-this.collider.width)/2+this.collider.offsetX,this.collider.y=this.pos.y+(this.height-this.collider.height)/2+this.collider.offsetY}draw(){this.currentAnimation&&this.currentAnimation.draw(t.context,this.pos.x,this.pos.y),window.debugMode&&(this.collider.width>0||this.collider.height>0)&&(t.context.lineWidth=1,t.context.strokeStyle="magenta",t.context.strokeRect(this.collider.x,this.collider.y,this.collider.width,this.collider.height))}}class g{constructor(t,e,s,i,n,o,a){this.sheetId=t,this.frameTimes=e instanceof Array?e:Array(s.length).fill(e),this.frames=s,this.xOffset=i,this.yOffset=n,this.frameWidth=o,this.frameHeight=a,this.reset()}reset(){this.timer=0,this.playing=!1,this.currentFrameIndex=0}draw(t,e,s){t.drawImage(n.getImage(this.sheetId),this.xOffset,this.yOffset+this.frames[this.currentFrameIndex]*this.frameHeight,this.frameWidth,this.frameHeight,e,s,this.frameWidth,this.frameHeight)}play(){this.playing=!0}stop(){this.playing=!1}update(t){if(!this.playing)return;const e=this.frameTimes[this.currentFrameIndex]/1e3;this.timer+=t,this.timer>=e&&(this.timer=0,this.currentFrameIndex>=this.frames.length-1?this.currentFrameIndex=0:this.currentFrameIndex++)}}class m extends p{constructor(t,e,s,i,n,o,a,h){super("enemy",t,e,s,i,n,o,a,h)}}class f extends p{constructor(t,e,s,i){super("enemyAttack",{x:t.pos.x-e.x,y:t.pos.y-e.y},0,0,{width:s,height:i},1,1),this.offset=e,this.parent=t,this.canCollideWithTypes.add("player")}reset(t,e,s,i){super.reset(t.pos.x-e.x,t.pos.y-e.y),this.damage=1,this.collider.width=s,this.collider.height=i}}class y extends m{constructor(t,e){super({x:t,y:e},14,26,{width:14,height:14},1,1,{walk:new g("broomEnemy",200,[0,1,2],0,0,14,26),attack:new g("broomEnemy",[100,200,100,50,200,50],[0,1,2,3,4,5],14,0,28,26)},"walk"),this.speed=50,this.canCollideWithTypes.add("playerProjectile"),this.vel={x:0,y:0},this.attackDistance=20,this.steerTimer=.5*Math.random()+.5,this.headButt=null}update(t){let e,s=Number.MAX_SAFE_INTEGER;this.currentAnimation.update(t);let i=null;const n={x:0,y:0};for(const t of[...u.liveEntities].filter((t=>"player"==t.type)))e=Math.hypot(t.pos.x-this.pos.x,t.pos.y-this.pos.y),e<s&&(s=e,i=t);if(this.steerTimer<=0){const t={x:0,y:0};if(null===i)console.error("Could not find player closest to %s",this),this.currentAnimation.stop();else{t.x=i.pos.x-this.pos.x,t.y=i.pos.y-this.pos.y;const e=Math.hypot(t.x,t.y);t.x=this.speed*t.x/e,t.y=this.speed*t.y/e}n.x=t.x-this.vel.x,n.y=t.y-this.vel.y,this.steerTimer=.5*Math.random()+1}else this.steerTimer-=t;s<this.attackDistance?(this.currentAnimation!=this.animations.attack&&(this.currentAnimation.stop(),this.currentAnimation=this.animations.attack,this.currentAnimation.play()),this.headButt&&this.headButt.alive||!(this.currentAnimation.currentFrameIndex>3)||(this.headButt=u.spawn(f,this,{x:-(this.width+8),y:-16},20,6.5)),this.headButt&&this.headButt.alive&&this.currentAnimation.currentFrameIndex<4&&this.headButt.die()):(this.headButt&&this.headButt.alive&&this.headButt.die(),this.currentAnimation!=this.animations.walk&&(this.currentAnimation.stop(),this.currentAnimation=this.animations.walk,this.currentAnimation.play()),this.vel.x+=n.x,this.vel.y+=n.y,this.pos.x+=Math.round(this.vel.x*t),this.pos.y+=Math.round(this.vel.y*t)),super.update(t)}die(){this.headButt&&this.headButt.alive&&this.headButt.die(),super.die()}}class w extends p{constructor(t,e,s,i,n,o){super("playerProjectile"),this.canCollideWithTypes.add("enemy"),this.collider.width=3,this.collider.height=3,this.reset(t,e,s,i,n,o)}reset(t,e,s,i,n,o){super.reset(),this.pos={x:t,y:e},this.vel={x:320*s+n,y:320*i+o}}update(e){super.update(e);const s={x:this.vel.x*e,y:this.vel.y*e};Math.abs(s.x)>0&&Math.abs(s.y)>0&&(s.x*=Math.SQRT1_2,s.y*=Math.SQRT1_2),this.pos.x+=Math.round(s.x),this.pos.y+=Math.round(s.y),this.collider.x=this.pos.x-1,this.collider.y=this.pos.y-1,(this.pos.x<0||this.pos.x>t.canvas.width||this.pos.y<0||this.pos.y>t.canvas.height)&&this.die()}draw(){super.draw(),t.context.fillStyle="white",t.context.fillRect(this.pos.x-2,this.pos.y-2,4,4)}}const x=20,v=32,_={down:new g("player",150,[0,1,2,3],0,0,x,v),left:new g("player",150,[0,1,2,3],x,0,x,v),up:new g("player",150,[0,1,2,3],40,0,x,v),right:new g("player",150,[0,1,2,3],60,0,x,v),downB:new g("player",150,[3,2,1,0],0,0,x,v),leftB:new g("player",150,[3,2,1,0],x,0,x,v),upB:new g("player",150,[3,2,1,0],40,0,x,v),rightB:new g("player",150,[3,2,1,0],60,0,x,v)};class b extends p{constructor(t,e,s,i="right"){super("player",{x:e,y:s},x,v,{width:12,height:24},10,1,_,i),this.reset(t,e,s)}reset(t,e=0,s=0){super.reset(),this.controller=t,this.hp=10,this.shotTimer=0,this.dashing=0,this.resetPosition(e,s)}resetPosition(t,e){this.pos={x:t,y:e},this.vel={x:0,y:0},this.aim={x:0,y:0}}get alive(){return this.lives>0}set alive(t){this.lives=t?3:0}draw(){t.context&&this.currentAnimation.draw(t.context,this.pos.x,this.pos.y),super.draw()}move(t){if(this.controller){const t=this.controller.currentState;let e=S(t.up,t.down,t.left,t.right);this.dashing>-24?this.dashing--:this.dashing<=-24&&t.dash&&(console.log("dash"),this.dashing=10,this.vel.x=400*e.x,this.vel.y=400*e.y),this.dashing<=0&&(this.vel.x=110*e.x,this.vel.y=110*e.y)}this.pos.x+=Math.round(this.vel.x*t),this.pos.y+=Math.round(this.vel.y*t)}onTopWallCollision(t){super.onTopWallCollision(t),this.vel.y=0}onLeftWallCollision(t){super.onLeftWallCollision(t),this.vel.x=0}onBottomWallCollision(t){super.onBottomWallCollision(t),this.vel.y=0}onRightWallCollision(t){super.onRightWallCollision(t),this.vel.x=0}shoot(t){if(!this.controller)return;const e=this.controller.currentState;this.aim=S(e.shootUp,e.shootDown,e.shootLeft,e.shootRight),this.shotTimer<=0&&(e.shootUp||e.shootDown||e.shootLeft||e.shootRight)?(this.shotTimer=.08333333333333333,u.spawn(w,this.pos.x+this.width/2,this.pos.y+this.height/2,this.aim.x,this.aim.y,this.vel.x,this.vel.y),window.mute||n.getSound("shoot").play()):this.shotTimer-=t}animate(t){const e=this.currentAnimation;this.aim.y>0?this.currentAnimation=this.vel.y>=0?this.animations.down:this.animations.downB:this.aim.y<0?this.currentAnimation=this.vel.y<=0?this.animations.up:this.animations.upB:this.vel.y>0?this.currentAnimation=this.animations.down:this.vel.y<0&&(this.currentAnimation=this.animations.up),this.aim.x>0?this.currentAnimation=this.vel.x>=0?this.animations.right:this.animations.rightB:this.aim.x<0?this.currentAnimation=this.vel.x<=0?this.animations.left:this.animations.leftB:this.vel.x>0&&0==this.aim.y?this.currentAnimation=this.animations.right:this.vel.x<0&&0==this.aim.y&&(this.currentAnimation=this.animations.left),this.currentAnimation!=e&&this.currentAnimation.reset(),0!=this.vel.x||0!=this.vel.y?this.currentAnimation.play():this.currentAnimation.stop(),this.currentAnimation.update(t)}update(t){this.controller&&this.controller.update(t),this.move(t),this.shoot(t),this.animate(t),super.update(t)}die(){this.lives>1?(this.lives--,this.reset(this.controller,t.canvas.width/2,t.canvas.height/2)):u.kill(this)}}function S(t,e,s,i){let n={x:0,y:0};return t&&(n.y+=-1),e&&(n.y+=1),s&&(n.x+=-1),i&&(n.x+=1),0!=n.x&&0!=n.y&&(n.x*=Math.sqrt(.8),n.y*=Math.sqrt(.8)),n}function A(t,e,s){return t.hasOwnProperty(e)?t[e]:s}class T{constructor(t={}){if(this.width=A(t,"width",16),this.height=A(t,"height",16),this.dfltValue=t.dfltValue,this.entries=new Array(this.width*this.height),t.entries)for(let e=0;e<this.height;e++)for(let s=0;s<this.width;s++){let i=this.index(s,e);i<t.entries.length&&this.set(t.entries[i],s,e)}this._count=0}get length(){return this._count}index(t,e){if("number"==typeof t){if(t>=0&&t<this.width&&e>=0&&e<this.height)return t+this.width*e}else if("x"in t&&"y"in t&&t.x>=0&&t.x<this.width&&t.y>=0&&t.y<this.height)return t.x+this.width*t.y;return-1}get(t,e,s){let i=this.index(t,e);return-1==i?null!=s?s:this.dfltValue:this.entries[i]}set(t,e,s){let i=this.index(e,s);-1!=i&&(this.entries[i]=t),this._count++}remove(t,e){let s=this.index(t,e);-1!=s&&(this.entries[s]=void 0),this._count--}*[Symbol.iterator](){for(let t=0;t<this.entries.length;t++)void 0!==this.entries[t]&&(yield this.entries[t])}walk(t){for(let e=0;e<this.entries.length;e++)void 0!==this.entries[e]&&t(this.entries[e])}toString(){return Fmt.toString("Grid",this.width,this.height)}}let C;class B{constructor(){}init(){}reset(){return this}draw(){}update(t){d.update(t)}switchTo(t){d.reset(),console.log("%s - SWITCHING TO",window.performance&&window.performance.now?window.performance.now():(new Date).getTime(),t),C=t,C.reset()}}const k="higrass_a",E="lograss_b",M="fence_tlu",I="fence_bll",W="fence_blu",L="fence_tru",R="fence_brl",P="fence_bru",O="fence_t_a",D="fence_t_b",G="fence_l",j="fence_r",F="fence_b_a",H="fence_b_b",N="paver_a",K="paver_b",U="paver_c",Y="paver_d",X="undefined",q=[{name:"Level 1",loaded:!1,complete:!1,grid:new T({width:20,height:15,entries:["fence_tll",O,D,O,O,D,O,O,"fence_gate_tl",N,K,"fence_gate_tr",O,D,O,O,D,O,D,"fence_trl",k,k,k,k,k,k,k,k,k,U,Y,k,k,k,k,k,k,k,k,k,k,k,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,k,k,k,k,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,k,k,k,k,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,k,k,k,k,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,k,k,K,U,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,K,Y,N,K,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,N,U,k,k,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,k,k,k,k,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,k,k,k,k,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,k,k,k,k,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,k,k,k,k,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,k,k,k,k,k,k,k,k,k,k,k,K,U,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,k,Y,N,k,k,k,k,k,k,k,k,k]}),fg_grid:new T({width:20,height:15,entries:[X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,G,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,j,G,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,j,G,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,j,W,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,P,"fence_gate_lu",X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,"fence_gate_ru",X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,M,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,L,"fence_gate_ll",X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,"fence_gate_rl",G,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,j,G,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,j,G,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,j,G,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,j,W,X,X,X,X,X,X,X,L,X,X,M,X,X,X,X,X,X,X,P,I,F,F,H,F,H,F,F,R,X,X,I,F,H,F,F,H,F,F,R]}),waves:[],initialEnemies:[{cls:y,x:300,y:100},{cls:y,x:300,y:100},{cls:y,x:300,y:100}],boss:{cls:class extends m{constructor(t,e){super({x:t,y:e},37,62,{offsetY:14,width:37,height:31},60,2,{down:new g("lawnmower",1,[0],0,0,39,62),left:new g("lawnmower",1,[0],39,0,59,62),up:new g("lawnmower",1,[0],99,0,37,62),right:new g("lawnmower",1,[0],135,0,59,62)},"down"),this.speed=500,this.canCollideWithTypes.add("playerProjectile"),this.vel={x:0,y:0},this.attackTimer=.75,this.target=null,this.attacking=!1}update(t){if(this.currentAnimation.update(t),this.attacking)this.pos.x+=Math.round(this.vel.x*t),this.pos.y+=Math.round(this.vel.y*t),this.attacking=Math.hypot(this.pos.x-this.target.x,this.pos.y-this.target.y)>16;else if(this.attackTimer<=0){this.vel.x=0,this.vel.y=0;let t,e=Number.MAX_SAFE_INTEGER,s=null;const i={x:0,y:0};for(const i of[...u.liveEntities].filter((t=>"player"==t.type)))t=Math.hypot(i.pos.x-this.pos.x,i.pos.y-this.pos.y),t<e&&(e=t,s=i);this.target=Object.assign({},s.pos),this.attacking=!0,this.attackTimer=.25*Math.random()+.5,i.x=this.target.x-this.pos.x,i.y=this.target.y-this.pos.y;const n=Math.hypot(i.x,i.y);this.vel.x=this.speed*i.x/n,this.vel.y=this.speed*i.y/n}else this.attackTimer-=t;this.vel.y>0?this.currentAnimation=this.animations.down:this.vel.y<0&&(this.currentAnimation=this.animations.up),this.vel.x>Math.abs(this.vel.y)?this.currentAnimation=this.animations.right:this.vel.x<0&&Math.abs(this.vel.x)>Math.abs(this.vel.y)&&(this.currentAnimation=this.animations.left),super.update(t)}onTopWallCollision(t){this.attacking=!1,super.onTopWallCollision(t)}onLeftWallCollision(t){this.attacking=!1,super.onLeftWallCollision(t)}onBottomWallCollision(t){this.attacking=!1,super.onBottomWallCollision(t)}onRightWallCollision(t){this.attacking=!1,super.onRightWallCollision(t)}},x:110,y:30}},{name:"Level 2",loaded:!1,complete:!1,grid:new T({width:20,height:15,entries:Array(300).fill("floorTile")}),initialEnemies:[{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200},{cls:y,x:300,y:200}],waves:[{spawners:[{cls:y,x:20,y:10,amount:20},{cls:y,x:20,y:200,amount:20},{cls:y,x:300,y:10,amount:20},{cls:y,x:300,y:200,amount:20}],timeOut:1/0}],boss:{cls:y,x:110,y:100}}],z={attract:new class extends B{reset(){return d.reset(),d.on(["start"],(t=>{this.switchTo(z.select)})),d.on("credits",(()=>{this.switchTo(z.credits)})),super.reset()}draw(){t.context.fillStyle="rgb(0, 64, 88)",t.context.fillRect(0,0,t.canvas.width,t.canvas.height),t.context.fillStyle="white",t.context.fillText('ATTRACT MODE, HIT "ENTER" KEY TO START PLAYING',10,t.canvas.height/2)}update(t){super.update(t)}},select:new class extends B{constructor(){super(),this.slots=[{input:null,avatar:"Julhilde",selected:!1},{input:null,avatar:"Calixto",selected:!1}],this.skippedGamePadStart=!1}selectSlot(t,e,s){t.selected=!0;const i=t.input;t.input=s,e.input==t.input&&(e.input=i,e.selected=null!=i)}reset(){return this.skippedGamePadStart=!1,this.slots[0].input=d.primaryControl,console.log("SET PRIMARY CONTROL",this.slots[0].input),this.slots[0].selected=!0,d.on("gamepadConnected",(t=>{for(const e of this.slots)if(!e.selected)return e.selected=!0,void(e.input=t)})),d.on("left",(t=>{this.selectSlot(this.slots[0],this.slots[1],t)})),d.on("right",(t=>{this.selectSlot(this.slots[1],this.slots[0],t)})),d.on("start",(e=>{if(!e.name.startsWith("Gamepad")||e!=d.primaryControl||this.skippedGamePadStart)if(this.slots.filter((t=>t.input===e)).length){const e=this.slots.filter((t=>t.selected));for(let s=0;s<e.length;s++){const i=e[s].input,n=u.spawn(b,i,s*(t.canvas.width-20),t.canvas.height/2,0==s?"right":"left");i.player=n}this.switchTo(z.game)}else for(const t of this.slots.filter((t=>!t.selected))){t.input=e,t.selected=!0;break}else this.skippedGamePadStart=!0})),super.reset()}update(t){super.update(t)}draw(){t.context.fillStyle="rgb(0, 64, 88)",t.context.fillRect(0,0,t.canvas.width,t.canvas.height),t.context.fillStyle="white";const e=t.canvas.width/this.slots.length-5;this.slots.forEach(((s,i)=>{t.context.lineWidth=10,t.context.strokeStyle=s.selected?"lime":"orange",t.context.strokeRect(i*e+5,5,(i+1)*e-5,t.canvas.height-5),null!=s.input&&(t.context.fillStyle="white",t.context.fillText(s.input.name,50+Math.round(t.canvas.width/2)*i,Math.round(t.canvas.height/2)))}))}},game:new class extends B{constructor(){super(),this.levelIndex=0,u.onCollision("playerProjectile","enemy",((t,e)=>{e.hurt(t.damage),t.die()})),u.onCollision("enemyAttack","player",((t,e)=>{e.hurt(t.damage),t.damage=0})),this.waveTimeOut=1/0,this.boss=null}loadLevel(){const t=q[this.levelIndex];for(const e of t.initialEnemies)u.spawn(e.cls,e.x,e.y);this.waves=Array.from(t.waves),t.loaded=!0}update(t){const e=q[this.levelIndex];if(e.loaded){const t=[...u.liveEntities].filter((t=>"enemy"==t.type));if(this.waveTimeOut<=0||t.length<=0)if(this.waves.length>0){console.log("Loading new wave");const t=this.waves.shift();this.waveTimeOut=t.timeOut;for(const e of t.spawners)Array(e.amount).fill().forEach((()=>{u.spawn(e.cls,e.x,e.y)}))}else t.length<=0&&null==this.boss?this.boss=u.spawn(e.boss.cls,e.boss.x,e.boss.y):null==this.boss||this.boss.alive||this.levelIndex<q.length-1&&this.levelIndex++}else this.loadLevel();this.waveTimeOut-=t,super.update(t),u.update(t)}drawGrid(e){if(e)for(let s=0;s<e.height;s++)for(let i=0;i<e.width;i++){const o=n.getImage(e.get(i,s)),a=16*i,h=16*s;o&&t.context.drawImage(o,a,h)}}draw(){const e=q[this.levelIndex];if(!e.loaded)return t.context.fillStyle="rgb(0, 64, 88)",t.context.fillRect(0,0,t.canvas.width,t.canvas.height),t.context.fillStyle="white",void t.context.fillText("LOADING ...",10,t.canvas.height/2);this.drawGrid(e.grid),u.draw(),this.drawGrid(e.fg_grid);for(const e of[...u.liveEntities].filter((t=>"player"==t.type))){let s=10,i=10;t.context.fillStyle="red",t.context.fillRect(10,10,50,10),t.context.fillStyle="green",t.context.fillRect(10,10,e.hp/10*50,10),s+=50,i+=5;const n=document.createElement("canvas");let o=e.currentAnimation;const a=o.frameWidth,h=o.frameHeight;n.context=n.getContext("2d"),n.width=a,n.height=h,o.draw(n.context,0,0),t.context.drawImage(n,s,i-h/4,a/2,h/2),s+=a/2,t.context.fillStyle="white",t.context.textBaseline="middle",t.context.fillText("x"+e.lives,s,i)}}},gameOver:new class extends B{},credits:new class extends B{}};C=z.attract,C.reset();let Q=0,V=window.performance&&window.performance.now?window.performance.now():(new Date).getTime();const $=1/60;function J(t){for(Q+=Math.min(1,(t-V)/1e3);Q>$;)Q-=$,C.update($);C.draw(),V=t,window.requestAnimationFrame(J)}function Z(t){C.init(),window.requestAnimationFrame(J)}window.debugMode=!1,window.mute=!1,window.onload=function(){t.canvas=document.getElementById(t.id),t.context=t.canvas.getContext("2d"),d.initialize(),n.loadAssets().then(Z)}})();