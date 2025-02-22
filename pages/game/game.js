// pages/game/game.js
const app = getApp();
const db = wx.cloud.database(); // 使用微信云数据库

Page({
  data: {
    gameState: 'setup', // 当前阶段：setup, voting, definition, speaking, guessing, scoring
    players: [], // 玩家列表 [{id, name, role, score}]
    currentSmartOne: null, // 当前大聪明玩家ID
    honestPerson: null, // 当前老实人玩家ID
    word: null, // 当前词汇
    definitions: [], // 提交的定义 [{playerId, content}]
    votes: [], // 词汇投票结果
    scores: {}, // 玩家分数 {playerId: score}
    round: 0, // 当前轮次
  },

  // 页面加载时初始化
  onLoad: function () {
    this.setupGame();
  },

  // 初始化游戏
  setupGame: async function () {
    // 获取玩家列表（假设通过邀请码加入）
    const players = await this.fetchPlayers();
    this.setData({ players, gameState: 'voting' });
    this.selectWord();
  },

  // 获取玩家数据
  fetchPlayers: async function () {
    // 通过云函数或数据库获取玩家信息
    return [{ id: 'p1', name: '玩家1', role: null, score: 0 }, { id: 'p2', name: '玩家2', role: null, score: 0 }];
  },

  // 选择词汇并投票
  selectWord: async function () {
    const wordList = ['犇', '赑屃', '黟']; // 示例词汇库
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    this.setData({ word, votes: [] });

    // 等待所有玩家投票
    wx.showModal({
      title: `词汇: ${word}`,
      content: '你认识这个词吗？',
      confirmText: '认识',
      cancelText: '不认识',
      success: (res) => this.handleVote(res.confirm),
    });
  },

  // 处理投票
  handleVote: function (knowsWord) {
    const votes = this.data.votes;
    votes.push(knowsWord);
    this.setData({ votes });

    if (votes.length === this.data.players.length) {
      if (votes.every(v => !v)) { // 全票不认识
        this.assignRoles();
        this.setData({ gameState: 'definition' });
      } else {
        this.selectWord(); // 有人认识，重新选词
      }
    }
  },

  // 分配角色
  assignRoles: function () {
    const players = this.data.players;
    const smartOneIndex = this.data.round % players.length;
    const smartOne = players[smartOneIndex].id;
    const remaining = players.filter(p => p.id !== smartOne);
    const honestIndex = Math.floor(Math.random() * remaining.length);
    const honestPerson = remaining[honestIndex].id;

    players.forEach(p => {
      p.role = p.id === smartOne ? 'smart' : (p.id === honestPerson ? 'honest' : 'fibber');
    });

    this.setData({ players, currentSmartOne: smartOne, honestPerson });
    this.notifyHonestPerson();
  },

  // 通知老实人真实定义
  notifyHonestPerson: function () {
    const honestPlayer = this.data.players.find(p => p.id === this.data.honestPerson);
    wx.showModal({
      title: '你是老实人',
      content: `词汇: ${this.data.word}, 含义: 示例定义`, // 假设有定义库
      showCancel: false,
    });
  },

  // 提交定义
  submitDefinition: function (e) {
    const playerId = e.currentTarget.dataset.playerId;
    const content = e.detail.value;
    const definitions = this.data.definitions;
    definitions.push({ playerId, content });
    this.setData({ definitions });

    if (definitions.length === this.data.players.length - 1) { // 除大聪明外都提交
      this.setData({ gameState: 'speaking' });
      this.startSpeaking();
    }
  },

  // 开始发言阶段
  startSpeaking: function () {
    // 按顺序展示定义，大聪明观察
    const players = this.data.players;
    const smartOneIndex = players.findIndex(p => p.id === this.data.currentSmartOne);
    const order = [...players.slice(smartOneIndex + 1), ...players.slice(0, smartOneIndex)];
    console.log('发言顺序:', order.map(p => p.name));
    this.setData({ gameState: 'guessing' });
  },

  // 大聪明猜测
  guess: function (e) {
    const { fibberGuess, honestGuess } = e.detail; // {fibberGuess: 'p2', honestGuess: 'p1'}
    this.calculateScores(fibberGuess, honestGuess);
    this.setData({ gameState: 'scoring' });
  },

  // 计算分数
  calculateScores: function (fibberGuess, honestGuess) {
    let scores = { ...this.data.scores };
    const honestPerson = this.data.honestPerson;
    const smartOne = this.data.currentSmartOne;

    // 初始化分数
    if (!scores[smartOne]) scores[smartOne] = 0;
    if (!scores[honestPerson]) scores[honestPerson] = 0;

    // 猜瞎掰人
    if (fibberGuess !== honestPerson) {
      scores[smartOne] += 1; // 猜对瞎掰人
    }

    // 猜老实人
    if (honestGuess === honestPerson) {
      scores[smartOne] += 1;
      scores[honestPerson] += 1;
    } else {
      if (!scores[honestGuess]) scores[honestGuess] = 0;
      scores[honestGuess] += 3; // 猜错，瞎掰人得3分
    }

    this.setData({ scores });
    this.nextRound();
  },

  // 下一轮
  nextRound: function () {
    const round = this.data.round + 1;
    if (round < this.data.players.length) {
      this.setData({ round, gameState: 'voting', definitions: [] });
      this.selectWord();
    } else {
      this.endGame();
    }
  },

  // 结束游戏
  endGame: function () {
    const scores = this.data.scores;
    const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    wx.showToast({
      title: `游戏结束！获胜者: ${this.data.players.find(p => p.id === winner).name}`,
    });
  },
});