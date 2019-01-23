import { create } from "domain";
import { EventEmitter } from "events";
import styles from '../styles/styles.js';
import Scrollable from '../components/Scrollable.js';
/**
 * @description this class is responsible for all the menu bar actions
 */
export default class Menu extends EventEmitter {
    /**
     * 
     * @param {*} ctx context of the game
     */
    constructor(ctx){
        super(ctx, ctx.world);
        this.game = ctx;
        this.createMenu();
    }
    /**
     * @description this will handle menu options open animation
     */
    showMenu(){
        for (const btn in this.obj_menuButtons) {
            if (this.obj_menuButtons.hasOwnProperty(btn)) {
                this.obj_menuButtons[btn].visible = true;
            }
        }
        this.obj_tweenProperties = {
            rules:{
                x:100,
                y:238,
                duration:500,
            },
            history:{
                x:100,
                y:376,
                duration:500
            },
            sound:{
                x:100,
                y:514,
                duration:500
            },
            exit:{
                x:100,
                y:652,
                duration:500
            },
            tweenType:'Quart.easeOut'
        };
        let btn_rulesOptionsTween = this.game.add.tween(this.btn_rulesOptions).to({y:this.obj_tweenProperties.rules.y}, this.obj_tweenProperties.rules.duration, this.obj_tweenProperties.tweenType, true);
        btn_rulesOptionsTween.onComplete.add(()=>{
            this.currentBg = this.arr_optionsBgs[0];
            this.img_rulesOptionsBg.visible = true;
            this.btn_rulesOptions.frameName = this.btn_rulesOptions._onDownFrame;
            this.btn_rulesOptions.freezeFrames = true;
            this.showRules();
            
        }, this.game);
        let btn_exitOptionsTween = this.game.add.tween(this.btn_leaveOptions).to({y:this.obj_tweenProperties.exit.y}, this.obj_tweenProperties.exit.duration, this.obj_tweenProperties.tweenType, true);
        let btn_soundOptionsTween = this.game.add.tween(this.btn_soundOptions).to({y:this.obj_tweenProperties.sound.y}, this.obj_tweenProperties.sound.duration, this.obj_tweenProperties.tweenType, true);
        let btn_historyOptionsTween = this.game.add.tween(this.btn_historyOptions).to({y:this.obj_tweenProperties.history.y}, this.obj_tweenProperties.history.duration, this.obj_tweenProperties.tweenType, true);
    
        if (this.currentOnBtn != undefined) {
            this.currentOnBtn.frameName = this.currentOnBtn._onOutFrame;
        }
    }
    /**
     * @description drawing the sprites of Menu
     */
    createMenu(){
        this.srNos = [];
        this.handIds = [];
        this.playAmounts = [];
        this.wins = [];

        this.txt_srNos = [];
        this.txt_handIds = [];
        this.txt_playAmounts = [];
        this.txt_wins = [];

        this.rules = this.game.cache.getJSON('rules');

         // rules bg
         this.img_rulesOptionsBg = this.game.add.image(0, 163, 'menu', 'menu_rules_bg');
         this.img_rulesOptionsBg.x = this.game.world.width - this.img_rulesOptionsBg.width - 30;
         this.img_rulesOptionsBg.visible = false;
         // history bg
         this.img_historyOptionsBg = this.game.add.image(0, 170, 'menu', 'menu-history_bg');
         this.img_historyOptionsBg.x = this.game.world.width - this.img_historyOptionsBg.width - 30;
         this.img_historyOptionsBg.visible = false;
         this.scrollGameHistory = new Scrollable(this.game, this.img_historyOptionsBg.x + 60, this.img_historyOptionsBg.y + 240, this.img_historyOptionsBg.width, this.img_historyOptionsBg.height - 310);
         // sound bg
         this.img_soundOptionsBg = this.game.add.image(0, 297, 'menu', 'menu_sound_bg');
         this.img_soundOptionsBg.x = this.game.world.width - this.img_soundOptionsBg.width - 30;
         this.img_soundOptionsBg.visible = false;
         this.btn_soundOptionsOn = this.game.add.button(this.img_soundOptionsBg.width/4, this.img_soundOptionsBg.height - 82, 'menu', '', this.game, 'menu_sound_onbtn', 'menu_sound_onbtn','menu_sound_onbtn','menu_sound_onbtn');
         this.img_soundOptionsBg.addChild(this.btn_soundOptionsOn);
         // exit bg
         this.img_exitOptionsBg = this.game.add.image(400, 435, 'menu', 'menu_exit_bg');
         this.img_exitOptionsBg.x = this.game.world.width - this.img_exitOptionsBg.width - 30;
         this.img_exitOptionsBg.visible = false;
         this.btn_exitOptionsOk = this.game.add.button(this.img_exitOptionsBg.width/4.2, this.img_exitOptionsBg.height - 80, 'game_assets', '', this.game, 'exit_okbtn', 'exit_okbtn','exit_okbtn','exit_okbtn');
         this.btn_exitOptionsOk.anchor.set(0.5);
         this.img_exitOptionsBg.addChild(this.btn_exitOptionsOk);
         this.btn_exitOptionsCancel = this.game.add.button(0, 0, 'game_assets','', this.game, 'exit_cancel', 'exit_cancel', 'exit_cancel', 'exit_cancel');
         this.btn_exitOptionsCancel.anchor.set(0.5);
         this.btn_exitOptionsCancel.alignTo(this.btn_exitOptionsOk, Phaser.RIGHT_CENTER, 25);
         this.img_exitOptionsBg.addChild(this.btn_exitOptionsCancel);
         
         this.arr_optionsBgs = [this.img_rulesOptionsBg, this.img_historyOptionsBg, this.img_soundOptionsBg, this.img_exitOptionsBg];
         this.arr_optionsBgs.forEach(spr => {
             this.btn_closePopup = this.game.add.button(0, 0, 'menu', '', this.game, 'menu_closebtn_selected', 'menu_closebtn', 'menu_closebtn_selected', 'menu_closebtn');
             this.btn_closePopup.anchor.setTo(0.5);
             this.btn_closePopup.onInputDown.add(this.closeCallback, this);
             spr.addChild(this.btn_closePopup);
         });
        
        // rules button
        // history button
        // sound button
        // exit button
        this.btn_leaveOptions	= this.game.add.button(this.game.world.width - 100, 100, 'menu', "", this.game, 'menu_exit_btn_selected', 'menu_exit_btn', 'menu_exit_btn_selected','menu_exit_btn_selected');
        this.btn_soundOptions	= this.game.add.button(this.game.world.width - 100, 100, 'menu', "", this.game, 'menu_sound_btn_selected', 'menu_sound_btn', 'menu_sound_btn_selected', "menu_sound_btn_selected");
        this.btn_historyOptions = this.game.add.button(this.game.world.width - 100, 100, 'menu', "", this.game, 'menu_history_btn_selected','menu_history_btn', 'menu_history_btn_selected', 'menu_history_btn_selected');
        this.btn_rulesOptions = this.game.add.button(this.game.world.width - 100, 100, "menu", "", this.game, "menu_rules_btn_selected", "menu_rules_btn", "menu_rules_btn_selected", "menu_rules_btn_selected");
        //this.btn_leaveOptions.alignTo(this.btn_soundOptions, Phaser.BOTTOM_CENTER, 0, 10);

        // buttons properties
        this.obj_menuButtons = {
            "soundOn":this.btn_soundOptionsOn, 
            "history":this.btn_historyOptions, 
            "rules":this.btn_rulesOptions, 
            "sound":this.btn_soundOptions, 
            "exit":this.btn_leaveOptions, 
            "exitOk":this.btn_exitOptionsOk, 
            "exitCancel":this.btn_exitOptionsCancel
        };
        for (const btn in this.obj_menuButtons) {
                this.obj_menuButtons[btn].visible = false;
                this.obj_menuButtons[btn].anchor.setTo(0.5);
                this.obj_menuButtons[btn].onInputDown.add(eval("this."+ btn +"Callback"), this);
        }
        
        // bitmap texts
        this.txt_rules = this.game.add.text(this.img_rulesOptionsBg.width/2.4, 40, "RULES", styles.fnt_rulesStyle);
        this.txt_rules_con = this.game.add.text(50, 120, this.rules.rules_header, styles.fnt_rulesStyle_content);
        this.txt_payOut = this.game.add.text(this.img_rulesOptionsBg.width/2.4, 375, "PAYOUT", styles.fnt_rulesPayoutStyle);
        this.txt_type = this.game.add.text(80, 450, "TYPE", styles.fnt_rulesPayoutStyleMedium);
        this.txt_payOutInTable = this.game.add.text(this.img_rulesOptionsBg.width/1.39, 450, "PAYOUT", styles.fnt_rulesPayoutStyleMedium);
        
        let _x = this.img_rulesOptionsBg.x + 40;
        let _y = 10;
        
        let __x = this.img_rulesOptionsBg.width/1.4;
        let __y = 10;
        
        this.scroll_rules = new Scrollable(this.game, _x + 20, 680, this.img_rulesOptionsBg.width, this.img_rulesOptionsBg.height/2.7);
        for (let key in this.rules.table_type) {
                const txt = this.rules.table_type[key];
                const txtValue = this.rules.table_payout[key];
                this.keyType = key;
                this.keyType=this.game.add.text(0, _y, txt, styles.fnt_rulesTableStyle);
                this.keyValue=this.game.add.text(__x, _y, txtValue, styles.fnt_rulesTableStyle);
                // this.keyValue.alignTo(this.keyType, Phaser.RIGHT_CENTER, 100, 0);
                this.scroll_rules.addChild(this.keyType);
                this.scroll_rules.addChild(this.keyValue);

                _y += (this.keyType.height/2) + 60;
                this.scroll_rules.start();
        }
        this.scroll_rules.visible = false;
        // for (let key in this.rules.table_payout) {
        //     if (this.rules.table_payout.hasOwnProperty(key)) {
        //         const txt = this.rules.table_payout[key];
        //         this.key = key;
        //         this.key=this.game.add.text(__x, __y, txt, styles.fnt_rulesTableStyle);
        //         this.scroll_rules.addChild(this.key);
        //         __y += (this.key.height/2) + 60;
        //         this.scroll_rules.start();
        //     }
        // }
        let arr_rulesTexts = [this.txt_rules, this.txt_rules_con, this.txt_payOut, this.txt_payOutInTable, this.txt_type];
        arr_rulesTexts.forEach(txt => {
            this.img_rulesOptionsBg.addChild(txt);
        });


        // history
        this.txt_history = this.game.add.text(this.img_historyOptionsBg.width/2.8, 50, 'GAME HISTORY', styles.fnt_historyStyle);
        this.txt_historySno = this.game.add.text(120, 170, 'S.No', styles.fnt_historyTableStyle);
        this.txt_historySno.anchor.set(0.5);

        this.txt_historyHandId = this.game.add.text(0, 0, 'HAND ID', styles.fnt_historyTableStyle);
        this.txt_historyHandId.anchor.set(0.5);
        this.txt_historyHandId.alignTo(this.txt_historySno, Phaser.RIGHT_CENTER, 222, 0);

        this.txt_historyPlay = this.game.add.text(0, 0, 'PLAY', styles.fnt_historyTableStyle);
        this.txt_historyPlay.anchor.set(0.5);
        this.txt_historyPlay.alignTo(this.txt_historyHandId, Phaser.RIGHT_CENTER, 280, 0);

        this.txt_historyWin = this.game.add.text(0, 0, 'WIN', styles.fnt_historyTableStyle);
        this.txt_historyWin.anchor.set(0.5);
        this.txt_historyWin.alignTo(this.txt_historyPlay, Phaser.RIGHT_CENTER, 240, 0);

        let arr_historyTableTexts = [this.txt_history, this.txt_historySno,this.txt_historyHandId, this.txt_historyPlay, this.txt_historyWin];
        arr_historyTableTexts.forEach(txt => {
            this.img_historyOptionsBg.addChild(txt);
        }); 

        this.txt_soundTxt = this.game.add.text(this.img_soundOptionsBg.width/2.5, 70, 'SOUND', styles.fnt_soundStyle);
        this.txt_soundTxt.anchor.set(0.5);
        this.txt_soundOn = this.game.add.text(0, 0, 'On', styles.fnt_soundBtnStyle);
        this.txt_soundOn.anchor.set(0.5);
        this.txt_soundOn.alignIn(this.btn_soundOptionsOn, Phaser.CENTER);
        this.txt_soundOff = this.game.add.text(0, 0, 'Off', styles.fnt_soundBtnStyle);
        this.txt_soundOff.anchor.set(0.5);
        this.txt_soundOff.alignTo(this.txt_soundOn, Phaser.RIGHT_CENTER, this.btn_soundOptionsOn.width/1.5, 0);


        let arr_soundTexts = [this.txt_soundTxt, this.txt_soundOn, this.txt_soundOff];
        arr_soundTexts.forEach(txt => {
            this.img_soundOptionsBg.addChild(txt);
        });
        
        this.txt_exitTxt = this.game.add.text(this.img_exitOptionsBg.width/2.5, this.img_exitOptionsBg.height/3, 'ARE YOU SURE YOU\n WANT TO LEAVE?', styles.fnt_historyTableStyle);
        this.txt_exitTxt.anchor.set(0.5);
        this.img_exitOptionsBg.addChild(this.txt_exitTxt);
    }

    /**
     * @description this function will handle close animation of menu options
     */
    closeMenu(){
        this.currentBg.visible = false;
        let btn_exitOptionsTweenback = this.game.add.tween(this.btn_leaveOptions).to({y:100}, this.obj_tweenProperties.exit.duration, this.obj_tweenProperties.tweenType, true);
        let btn_soundOptionsTweenback = this.game.add.tween(this.btn_soundOptions).to({y:100}, this.obj_tweenProperties.sound.duration, this.obj_tweenProperties.tweenType, true);
        let btn_historyOptionsTweenback = this.game.add.tween(this.btn_historyOptions).to({y:100}, this.obj_tweenProperties.history.duration, this.obj_tweenProperties.tweenType, true);
        let btn_rulesOptionsTweenback = this.game.add.tween(this.btn_rulesOptions).to({y:100}, this.obj_tweenProperties.rules.duration, this.obj_tweenProperties.tweenType, true);
        btn_exitOptionsTweenback.onComplete.add(()=>{
            for (const btn in this.obj_menuButtons) {
                if (this.obj_menuButtons.hasOwnProperty(btn)) {
                    this.obj_menuButtons[btn].visible = false;
                }
            }
            this.clearScrollableMask();
            this.emit('menu_close', {closed: true});
        }, this.game);

    }
    
    /**
     * @description handles menu options bg's visibility (true|false)
     * @param {String} imagename - "rules"|"history"|"sound"|"exit"
     * @param {boolean} action - default its true
     */
    handleImageVisibility(imagename, action = true){
        let obj_menuBg = {
            "rules":this.img_rulesOptionsBg, 
            "history":this.img_historyOptionsBg, 
            "sound":this.img_soundOptionsBg, 
            "exit":this.img_exitOptionsBg
        };
        for (const key in obj_menuBg) {
            if (key == imagename) {
                obj_menuBg[key].visible = action;
                this.currentBg = obj_menuBg[key];
            } else {
                obj_menuBg[key].visible = !action;
            }
        }
    }
    /**
     * @description this function handles the change of frames of the menu buttons
     * @param {string} btnName - "rules"|"history"|"sound"|"exit" 
     * @param {boolean} [true] - action 
     */
    handleBtnFrames(btnName, action = true){
        let obj_menu = {
            "rules":this.btn_rulesOptions, 
            "history":this.btn_historyOptions, 
            "sound":this.btn_soundOptions, 
            "exit":this.btn_leaveOptions
        };
        for (const key in obj_menu) {
            if (key == btnName) {
                obj_menu[key].freezeFrames = action;
                this.currentOnBtn = obj_menu[key];
            } else {
                obj_menu[key].freezeFrames = !action;
                obj_menu[key].frameName = obj_menu[key]._onOutFrame;
            }
        }
    }
    rulesCallback(){
        this.handleImageVisibility("rules");
        this.handleBtnFrames("rules");
    }

    historyCallback(){
        this.handleImageVisibility('history');
        this.handleBtnFrames("history");
        this.showHistoryData();
    }

    soundCallback(){
        this.handleImageVisibility('sound');
        this.handleBtnFrames("sound");
    }

    exitCallback(){
        this.handleImageVisibility('exit');
        this.handleBtnFrames("exit");
    }

    soundOnCallback(){
        console.log('soundOn :', 'soundOn');
    }

    closeCallback(){
        this.currentBg.visible = false;
        this.closeMenu();
    }

    exitOkCallback(){
        console.log('exitOk :', 'exitOk');
    }

    exitCancelCallback(){
        console.log('exitCancel :', 'exitCancel');
    }

    addDataToHistory(){

    }
    // this.srNos = [];
    showHistoryData(){
        for(let i = 0; i < this.srNos.length; i++){
            console.log('handIds :', this.handIds);
            if(i == 0){
                this.txt_srNos[i] = this.game.add.text(60, 13, this.srNos[i] + "");
                this.txt_srNos[i].anchor.set(0.5);
                // this.txt_srNos[i].alignTo(this.txt_historySno, Phaser.BOTTOM_CENTER, 0, 10);
                
                this.txt_handIds[i] = this.game.add.text(0, 0, this.handIds[i] + "");
                this.txt_handIds[i].anchor.set(0.5);
                this.txt_handIds[i].alignTo(this.txt_srNos[i], Phaser.RIGHT_CENTER, 250, 0);
            }else{
                this.txt_srNos[i] = this.game.add.text(0, 0, this.srNos[i] + "");
                this.txt_srNos[i].anchor.set(0.5);
                this.txt_srNos[i].alignTo(this.txt_srNos[i-1], Phaser.BOTTOM_CENTER, 0, 30);

                this.txt_handIds[i] = this.game.add.text(0, 0, this.handIds[i] + "");
                this.txt_handIds[i].anchor.set(0.5);
                this.txt_handIds[i].alignTo(this.txt_handIds[i-1], Phaser.BOTTOM_CENTER, 0, 30);
            }

            this.scrollGameHistory.addChild(this.txt_srNos[i]);
            this.scrollGameHistory.addChild(this.txt_handIds[i]);
            this.scrollGameHistory.visible = true;
            this.scrollGameHistory.start();
        }
    }

    clearScrollableMask(){
        this.scrollGameHistory.stop();
        this.scrollGameHistory.visible = false;
        this.scrollGameHistory.maskGraphics.clear(0, 0, 0, 0);
    }

    clearRulesScroll(){
        this.scroll_rules.visible = false;
        this.scroll_rules.stop();
    }
    showRules(){
        this.scroll_rules.visible = true;
        this.scroll_rules.start();  
    }
    
}