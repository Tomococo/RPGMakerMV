//=============================================================================
// WindowBackImage.js
// ----------------------------------------------------------------------------
// (C)2017 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.6.1 2023/05/01 参照されていないメソッドを削除し、一部パラメータのデフォルト値を変更
// 2.6.0 2022/12/15 項目、項目背景、カーソルをパーツ単位で非表示にできる機能を追加
// 2.5.0 2022/06/06 ステータス画面用の装備、パラメータウィンドウを編集対象に追加
// 2.4.0 2022/05/16 マウスオーバーしたときにさらに別の画像に差し替える機能を追加
// 2.3.2 2021/11/14 メニュー画面などで開いたときに一瞬だけウィンドウフレームが見えてしまう問題を修正
// 2.3.1 2021/09/04 ウィンドウの幅か高さが0のときは背景画像を非表示にするよう修正
// 2.3.0 2021/05/06 名前ウィンドウがプリセットになかったので追加
//                  ウィンドウが重なったときに背後をマスキングしない設定を追加
// 2.2.0 2021/02/27 ウィンドウごとに個別のフォントを指定できる機能を追加
// 2.1.0 2021/01/24 ウィンドウごとに個別のウィンドウスキンを指定できる機能を追加
// 2.0.3 2020/12/16 指定対象外のウィンドウで余計な処理が実行されてしまう問題を修正
// 2.0.2 2020/10/15 指定可能なウィンドウに戦闘画面のステータスウィンドウを追加
// 2.0.1 2020/08/22 カスタムメニュープラグインで作成したウィンドウ背景を変えられる機能を追加
// 2.0.0 2020/08/13 MZ対応版作成
// 1.3.0 2019/01/13 ウィンドウ背景の画像を複数表示できる機能を追加
//                  ウィンドウ背景を指定した場合も元のウィンドウフレームを表示したままにできる機能を追加
// 1.2.0 2018/11/29 ウィンドウ背景を有効にするかどうかを動的に制御するスイッチを追加
// 1.1.0 2017/11/19 拡大率を設定できる機能を追加
// 1.0.0 2017/11/18 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc ウィンドウ背景画像指定プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/WindowBackImage.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param windowImageInfo
 * @text ウィンドウ画像情報
 * @desc 背景画像を差し替えるウィンドウの情報です。
 * @default
 * @type struct<WindowImages>[]
 *
 * @help WindowBackImage.js
 *
 * ウィンドウの背景を任意の画像に置き換えます。
 * 画像は複数指定可能で、それぞれに出現条件スイッチを指定できます。
 * 画像が表示された場合、元のウィンドウフレームを非表示するかどうかを
 * 選択できます。
 *
 * 背景画像はウィンドウのサイズにかかわらず、中央を原点に表示されます。
 * 拡大率と座標を補正することは可能ですがサイズが可変、不定のウィンドウに
 * 対して背景画像を指定することは推奨しません。
 *
 * プラグインによって追加されたウィンドウにも指定可能ですが
 * 正常に動作するとは限りません。
 *
 * SceneCustomMenu.jsで追加したウィンドウの背景を変えたい場合は
 * WindowClassの指定を同プラグインの『ウィンドウ識別子』を指定してください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~WindowImages:
 *
 * @param WindowClass
 * @text ウィンドウ
 * @desc 専用の画像に差し替える対象のウィンドウです。一覧にない場合は直接入力してください。
 * @type select
 * @default
 * @option [ゲーム全般]ヘルプウィンドウ
 * @value Window_Help
 * @option [ゲーム全般]お金ウィンドウ
 * @value Window_Gold
 * @option [メインメニュー]メインコマンドウィンドウ
 * @value Window_MenuCommand
 * @option [メインメニュー]アクターステータスウィンドウ
 * @value Window_MenuStatus
 * @option [アイテム画面]アイテムカテゴリウィンドウ
 * @value Window_ItemCategory
 * @option [アイテム画面]アイテムリストウィンドウ
 * @value Window_ItemList
 * @option [アイテム画面]アクター選択ウィンドウ
 * @value Window_MenuActor
 * @option [スキル画面]スキルタイプウィンドウ
 * @value Window_SkillType
 * @option [スキル画面]ステータスウィンドウ
 * @value Window_SkillStatus
 * @option [スキル画面]スキルリストウィンドウ
 * @value Window_SkillList
 * @option [装備画面]ステータスウィンドウ
 * @value Window_EquipStatus
 * @option [装備画面]装備コマンドウィンドウ
 * @value Window_EquipCommand
 * @option [装備画面]装備スロットウィンドウ
 * @value Window_EquipSlot
 * @option [装備画面]装備リストウィンドウ
 * @value Window_EquipItem
 * @option [ステータス画面]ステータスウィンドウ
 * @value Window_Status
 * @option [ステータス画面]装備ウィンドウ
 * @value Window_StatusEquip
 * @option [ステータス画面]パラメータウィンドウ
 * @value Window_StatusParams
 * @option [オプション画面]オプションウィンドウ
 * @value Window_Options
 * @option [セーブ、ロード画面]ファイルリストウィンドウ
 * @value Window_SavefileList
 * @option [ショップ画面]ショップコマンドウィンドウ
 * @value Window_ShopCommand
 * @option [ショップ画面]購入アイテムウィンドウ
 * @value Window_ShopBuy
 * @option [ショップ画面]売却アイテムウィンドウ
 * @value Window_ShopSell
 * @option [ショップ画面]数値入力ウィンドウ
 * @value Window_ShopNumber
 * @option [ショップ画面]ステータスウィンドウ
 * @value Window_ShopStatus
 * @option [名前入力画面]名前ウィンドウ
 * @value Window_NameEdit
 * @option [名前入力画面]名前入力ウィンドウ
 * @value Window_NameInput
 * @option [マップ画面]選択肢ウィンドウ
 * @value Window_ChoiceList
 * @option [マップ画面]数値入力ウィンドウ
 * @value Window_NumberInput
 * @option [マップ画面]アイテム選択ウィンドウ
 * @value Window_EventItem
 * @option [マップ画面]名前ウィンドウ
 * @value Window_NameBox
 * @option [マップ画面]メッセージウィンドウ
 * @value Window_Message
 * @option [マップ画面]スクロールメッセージウィンドウ
 * @value Window_ScrollText
 * @option [マップ画面]マップ名ウィンドウ
 * @value Window_MapName
 * @option [戦闘画面]バトルログウィンドウ
 * @value Window_BattleLog
 * @option [戦闘画面]パーティコマンドウィンドウ
 * @value Window_PartyCommand
 * @option [戦闘画面]アクターコマンドウィンドウ
 * @value Window_ActorCommand
 * @option [戦闘画面]バトラーステータスウィンドウ
 * @value Window_BattleStatus
 * @option [戦闘画面]アクター一覧ウィンドウ
 * @value Window_BattleActor
 * @option [戦闘画面]敵キャラ一覧ウィンドウ
 * @value Window_BattleEnemy
 * @option [戦闘画面]スキル一覧ウィンドウ
 * @value Window_BattleSkill
 * @option [戦闘画面]アイテム一覧ウィンドウ
 * @value Window_BattleItem
 * @option [タイトル画面]タイトルウィンドウ
 * @value Window_TitleCommand
 * @option [ゲーム終了画面]終了確認ウィンドウ
 * @value Window_GameEnd
 * @option [デバッグ画面]変数選択ウィンドウ
 * @value Window_DebugRange
 * @option [デバッグ画面]変数設定ウィンドウ
 * @value Window_DebugEdit
 * @option [行動目標ウィンドウプラグイン]行動目標ウィンドウ
 * @value Window_Destination
 * @option [行動目標ウィンドウプラグイン]メニュー行動目標ウィンドウ
 * @value Window_DestinationMenu
 * @option [ゲーム内時間の導入プラグイン]時間ウィンドウ
 * @value Window_Chronus
 * @option [公式ガチャプラグイン]ガチャ表示ウィンドウ
 * @value Window_Gacha
 * @option [公式ガチャプラグイン]コマンドウィンドウ
 * @value Window_GachaCommand
 * @option [公式ガチャプラグイン]入手確認ウィンドウ
 * @value Window_GachaGetCommand
 * @option [公式ガチャプラグイン]入手情報ウィンドウ
 * @value Window_GachaGet
 * @option [公式ガチャプラグイン]コストウィンドウ
 * @value Window_Cost
 * @option [ノベルゲーム総合プラグイン]ノベル選択肢ウィンドウ
 * @value Window_NovelChoiceList
 * @option [ノベルゲーム総合プラグイン]ノベルメッセージウィンドウ
 * @value Window_NovelMessage
 * @option [ノベルゲーム総合プラグイン]ノベルタイトルコマンドウィンドウ
 * @value Window_NovelTitleCommand
 * @option [ノベルゲーム総合プラグイン]ノベル数値入力ウィンドウ
 * @value Window_NovelNumberInput
 * @option [ノベルゲーム総合プラグイン]ポーズメニューウィンドウ
 * @value Window_PauseMenu
 * @option [クロスセーブプラグイン]パスワード入力ウィンドウ
 * @value Window_PasswordInput
 * @option [クロスセーブプラグイン]パスワードウィンドウ
 * @value Window_PasswordEdit
 * @option [用語辞典プラグイン]用語カテゴリウィンドウ
 * @value Window_GlossaryCategory
 * @option [用語辞典プラグイン]用語リストウィンドウ
 * @value Window_GlossaryList
 * @option [用語辞典プラグイン]使用確認ウィンドウ
 * @value Window_GlossaryConfirm
 * @option [用語辞典プラグイン]収集率ウィンドウ
 * @value Window_GlossaryComplete
 * @option [用語辞典プラグイン]用語ウィンドウ
 * @value Window_Glossary
 * @option [サウンドテストプラグイン]オーディオカテゴリウィンドウ
 * @value Window_AudioCategory
 * @option [サウンドテストプラグイン]オーディオリストウィンドウ
 * @value Window_AudioList
 * @option [サウンドテストプラグイン]オーディオ設定ウィンドウ
 * @value Window_AudioSetting
 * @option [数値入力画面プラグイン]数値入力ウィンドウ
 * @value Window_NumberInput
 * @option [数値入力画面プラグイン]数値ウィンドウ
 * @value Window_NumberEdit
 *
 * @param ImageFile
 * @text 差し替えファイル名
 * @desc 差し替える画像のファイル名です。(img/pictureの中から選択します)　空を指定すると枠だけが非表示になります。
 * @default
 * @dir img/pictures/
 * @type file
 *
 * @param ImageFileHover
 * @text ホバーファイル名
 * @desc マウスを重ねたときに差し替えられる画像のファイル名です。
 * @default
 * @dir img/pictures/
 * @type file
 *
 * @param WindowSkin
 * @text ウィンドウスキン
 * @desc 専用のウィンドウスキン画像です。
 * @default
 * @dir img/system/
 * @type file
 *
 * @param FontFace
 * @text フォント
 * @desc ウィンドウの専用フォントです。woffファイルを拡張子付きで指定してください。
 * @default
 *
 * @param OffsetX
 * @text X座標補正
 * @desc 表示X座標の補正値です。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param OffsetY
 * @text Y座標補正
 * @desc 表示Y座標の補正値です。
 * @default 0
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param ScaleX
 * @text 拡大率(横幅)
 * @desc X方向の拡大率(%指定)です。
 * @default 100
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param ScaleY
 * @text 拡大率(高さ)
 * @desc Y方向の拡大率(%指定)です。
 * @default 100
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param WindowShow
 * @text ウィンドウを残す
 * @desc ウィンドウの元背景を表示したままにします。
 * @default true
 * @type boolean
 *
 * @param ItemHide
 * @text 項目非表示
 * @desc ウィンドウの中身を非表示にします。
 * @default false
 * @type boolean
 *
 * @param ItemBackHide
 * @text 項目背景非表示
 * @desc ウィンドウの項目背景を非表示にします。
 * @default false
 * @type boolean
 *
 * @param CursorHide
 * @text カーソル非表示
 * @desc ウィンドウのカーソルを非表示にします。
 * @default false
 * @type boolean
 *
 * @param AllHide
 * @text 全体非表示
 * @desc ウィンドウ全体を非表示にします。注意して設定してください。
 * @default false
 * @type boolean
 *
 * @param SwitchId
 * @text 差し替えスイッチ番号
 * @desc 指定したスイッチがONのときのみウィンドウを差し替えます。
 * @default 0
 * @type switch
 *
 * @param OverlapOther
 * @text 他ウィンドウに重ねる
 * @desc 他のウィンドウと重なって表示させたときに背後のウィンドウをマスキングさせなくなります。
 * @default false
 * @type boolean
 *
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.windowImageInfo) {
        param.windowImageInfo = [];
    }

    const _Scene_Boot_loadGameFonts = Scene_Boot.prototype.loadGameFonts;
    Scene_Boot.prototype.loadGameFonts = function() {
        _Scene_Boot_loadGameFonts.apply(this, arguments);
        param.windowImageInfo.forEach(data => {
            if (data.FontFace) {
                FontManager.load(data.FontFace.replace(/\..*/, ''), data.FontFace);
            }
        })
    };

    //=============================================================================
    // Window
    //  専用の背景画像を設定します。
    //=============================================================================
    const _Window_initialize = Window.prototype.initialize;
    Window.prototype.initialize = function() {
        _Window_initialize.apply(this, arguments);
        this.frameVisible = this._frameSprite.visible;
    };

    const _Window__createAllParts      = Window.prototype._createAllParts;
    Window.prototype._createAllParts = function() {
        _Window__createAllParts.apply(this, arguments);
        this._backImageDataList = this.initBackImageData();
        if (this._backImageDataList.length > 0) {
            this._createBackImage();
        }
    };

    /**
     * 背景画像を作成します。
     * @private
     */
    Window.prototype._createBackImage = function() {
        this._backSprite.visible  = false;
        this._frameSprite.visible = false;
        this.frameVisible = false;
        this._windowBackImageSprites    = [];
        this._backImageDataList.forEach(backImageData => {
            const bitmap     = ImageManager.loadPicture(backImageData['ImageFile']);
            const hoverBitmapName = backImageData['ImageFileHover'];
            const hoverBitmap = hoverBitmapName ? ImageManager.loadPicture(hoverBitmapName) : null;
            const sprite     = new Sprite_WindowBackImage(bitmap, hoverBitmap);
            sprite.scale.x = (backImageData['ScaleX'] || 100) / 100;
            sprite.scale.y = (backImageData['ScaleY'] || 100) / 100;
            this._windowBackImageSprites.push(sprite);
            this._container.addChild(sprite);
            if (backImageData.OverlapOther) {
                this._isWindow = false;
            }
        }, this);
    };

    Window.prototype.initBackImageData = function() {
        let className = PluginManagerEx.findClassName(this);
        // for SceneCustomMenu.js
        if (this._data && this._data.Id) {
            className = this._data.Id;
        }
        return param.windowImageInfo.filter(function(data) {
            return data['WindowClass'] === className;
        }, this);
    };

    Window.prototype.getBackImageDataItem = function(index, propName) {
        return this._backImageDataList[index][propName];
    };

    const _Window__refreshAllParts      = Window.prototype._refreshAllParts;
    Window.prototype._refreshAllParts = function() {
        if (this._windowBackImageSprites) {
            this._refreshBackImage();
        }
        _Window__refreshAllParts.apply(this, arguments);
    };

    /**
     * 背景画像をリフレッシュします。
     * @private
     */
    Window.prototype._refreshBackImage = function() {
        this._windowBackImageSprites.forEach((sprite, index) => {
            sprite.x = this.width / 2 + this.getBackImageDataItem(index, 'OffsetX');
            sprite.y = this.height / 2 + this.getBackImageDataItem(index, 'OffsetY');
        });
    };

    const _Window_update      = Window.prototype.update;
    Window.prototype.update = function() {
        _Window_update.apply(this, arguments);
        if (!this._windowBackImageSprites) {
            return;
        }
        let defaultVisible = true;
        this._windowBackImageSprites.forEach((sprite, index) => {
            const switchId = this.getBackImageDataItem(index, 'SwitchId');
            sprite.visible = !switchId || $gameSwitches.value(switchId);
            if (this.width === 0 || this.height === 0) {
                sprite.visible = false;
            }
            if (sprite.visible && !this.getBackImageDataItem(index, 'WindowShow')) {
                defaultVisible = false;
            }
            if (this.getBackImageDataItem(index, 'ItemHide')) {
                this._contentsSprite.visible = false;
            }
            if (this.getBackImageDataItem(index, 'ItemBackHide')) {
                this._contentsBackSprite.visible = false;
            }
            if (this.getBackImageDataItem(index, 'CursorHide')) {
                this.cursorVisible = false;
            }
            if (this.getBackImageDataItem(index, 'AllHide')) {
                this.visible = false;
            }
            sprite.update();
        });
        this._backSprite.visible  = defaultVisible;
        this._frameSprite.visible = defaultVisible;
        this.frameVisible = defaultVisible;
    };

    const _Window_Base_loadWindowskin = Window_Base.prototype.loadWindowskin;
    Window_Base.prototype.loadWindowskin = function() {
        _Window_Base_loadWindowskin.apply(this, arguments);
        const list = this._backImageDataList;
        if (list && list.length > 0 && list[0].WindowSkin) {
            this.windowskin = ImageManager.loadSystem(list[0].WindowSkin);
        }
    };

    const _Window_Base_resetFontSettings = Window_Base.prototype.resetFontSettings;
    Window_Base.prototype.resetFontSettings = function() {
        _Window_Base_resetFontSettings.apply(this, arguments);
        const list = this._backImageDataList;
        if (list && list.length > 0 && list[0].FontFace) {
            this.contents.fontFace = list[0].FontFace.replace(/\..*/, '');
        }
    };

    //=============================================================================
    // Sprite_WindowBackImage
    //  ウィンドウ背景画像のスプライトです。
    //=============================================================================
    function Sprite_WindowBackImage() {
        this.initialize.apply(this, arguments);
    }

    Sprite_WindowBackImage.prototype             = Object.create(Sprite_Clickable.prototype);
    Sprite_WindowBackImage.prototype.constructor = Sprite_WindowBackImage;

    Sprite_WindowBackImage.prototype.initialize = function(bitmap, hoverBitmap) {
        Sprite_Clickable.prototype.initialize.call(this);
        this.bitmap   = bitmap;
        this._hoverBitmap = hoverBitmap;
        this._originalBitmap = bitmap;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    };

    Sprite_WindowBackImage.prototype.onMouseEnter = function() {
        if (this._hoverBitmap) {
            this.bitmap = this._hoverBitmap;
        }
    };

    Sprite_WindowBackImage.prototype.onMouseExit = function() {
        this.bitmap = this._originalBitmap;
    };
})();

