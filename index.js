//やること（✔︎①アニメーションをつける、(②編集機能)→ミニマルにいく（余裕があれば）、✔︎③時間帯追加）

const headerDate = document.getElementById('headerDate');
const form = document.getElementById('form');
const input = document.getElementById('input');
const timeStart = document.getElementById('timeStart');
const timeEnd = document.getElementById('timeEnd');
const ul = document.getElementById('ul');
const rate = document.getElementById('rate');
const trash = document.getElementById('trash');
const sort = document.getElementById('sort');


// 初期状態は、trash,sortを非表示
trash.style.display = 'none';
sort.style.display = 'none';

// today日付を入れる
const today = formatDate(new Date());
headerDate.innerText = '人生で一度の' + today;


$(function () {
  $('#header').animate({
    opacity: 0
  }, 0, function () {
    $('#header').animate({
      opacity: 1
    }, 5000);
  });

  $('#headerDate').animate({
    opacity: 0
  }, 0, function () {
    $('#headerDate').animate({
      opacity: 1
    }, 2000);
  });

  $('#form').animate({
    opacity: 0
  }, 0, function () {
    $('#form').animate({
      opacity: 1
    }, 2000);
  });
});


const dbName = 'todoDB';
const dbVersion = 1;

const db = new Dexie(dbName);
db.version(dbVersion).stores({
  rows: 'timeStartData,text,timeEndData,completed'
});


db.rows.each(rows => {
  let todos = rows;
  // ストレージにデータあれば表示
  if (todos) {
    add(todos);

    $('#rate').animate({
      opacity: 0
    }, 0, function () {
      $('#rate').animate({
        opacity: 1
      }, 2000);
    });

    $('#ul').animate({
      opacity: 0
    }, 0, function () {
      $('#ul').animate({
        opacity: 1
      }, 2000);
    });
  };
});


// フォームに入力し、＋アイコンかEnterが押されれば追加
form.addEventListener('submit', function (event) {
  event.preventDefault();
  add();
});

// 追加されたときの機能
async function add(todo) {
  let toDoText = input.value;
  let toDoTimeStart = timeStart.value;
  let toDoTimeEnd = timeEnd.value;

  // 開始時間が同じリストが作成された場合はアラート
  const check = await db.rows.get(toDoTimeStart).catch((e) => {
    console.error(e);
  });
  if (toDoTimeStart !== '' && check !== undefined) {
    window.alert('同じ開始時間に別のToDoがあります。\nリロードや並び替えをすると\n後に入れたToDoが消えますのでご注意ください。');
  };

  // ストレージのデータ（todoオブジェクトのtextプロパティ値）をテキスト表示
  if (todo) {
    toDoText = todo.text;
    toDoTimeStart = todo.timeStartData;
    toDoTimeEnd = todo.timeEndData;
  };

  // 入力無しなら、Alert
  if (toDoText && toDoTimeStart && toDoTimeEnd && toDoTimeStart < toDoTimeEnd) {
    const li = document.createElement('li');
    li.innerText = toDoText;
    li.classList.add('list-group-item', 'd-flex', 'flex-row', 'align-items-center', 'f_box');
    // 追加時にアニメーション
    $(li).animate({
      opacity: 0
    }, 0, function () {
      $(li).animate({
        opacity: 1
      }, 1000);
    });


    const span1 = document.createElement('span');
    span1.innerText = toDoTimeStart;
    span1.classList.add('f_item');
    const span2 = document.createElement('span');
    span2.innerText = toDoTimeEnd;
    span2.classList.add('f_item', 'sp');
    const small = document.createElement('small');
    small.innerText = '-';
    small.classList.add('f_item', 'p-1');
    li.prepend(span2);
    li.prepend(small);
    li.prepend(span1);


    // 子要素追加
    // マイナスボタン
    const minus = document.createElement('button');
    minus.classList.add('border-0', 'rounded', 'btn', 'btn-default', 'f_item');
    const i1 = document.createElement('i');
    i1.classList.add('bi', 'bi-dash-circle-fill');
    i1.style = 'font-size:16px';

    minus.classList.add('border-0', 'rounded');
    minus.appendChild(i1);

    li.appendChild(minus);

    // Editボタン
    // const edit = document.createElement('button');
    // edit.classList.add('border-0', 'rounded', 'btn', 'btn-default');
    // const i2 = document.createElement('i');
    // i2.classList.add('bi', 'bi-pencil-square');
    // i2.style = 'font-size:16px';

    // edit.classList.add('border-0', 'rounded');
    // edit.appendChild(i2);

    // li.prepend(edit);

    // doneボタン（初期表示は非表示）
    // const done = document.createElement('button');
    // done.type = 'submit';
    // done.classList.add('border-0', 'rounded', 'btn', 'btn-default');
    // const i3 = document.createElement('i');
    // i3.classList.add('bi', 'bi-check-circle-fill');
    // i3.style = 'font-size:16px';

    // done.classList.add('border-0', 'rounded');
    // done.appendChild(i3);

    // li.prepend(done);
    // done.style.display = 'none';

    // trash,sort表示
    trash.style.display = 'block';
    sort.style.display = 'block';

    $('#trash').animate({
      opacity: 0
    }, 0, function () {
      $('#trash').animate({
        opacity: 1
      }, 1500);
    });

    $('#sort').animate({
      opacity: 0
    }, 0, function () {
      $('#sort').animate({
        opacity: 1
      }, 1000);
    });


    // todoオブジェクトがあって、completedプロパティ値がTrueなら、クラスを追加
    if (todo && todo.completed) {
      li.classList.add('text-decoration-line-through', 'list-group-item-dark');
      li.classList.add('list-group-item-dark');
    };


    // リストが押されたら、線を引いてグレーアウト
    li.addEventListener('click', function () {
      li.classList.toggle('text-decoration-line-through');
      li.classList.toggle('list-group-item-dark');
      saveData();
      result();
    });


    // マイナスボタン押されたら、アニメーション付けて、データ削除
    minus.addEventListener('click', function () {
      li.classList.toggle('text-decoration-line-through');
      li.classList.toggle('list-group-item-dark');
      $(li).animate({
        opacity: 1
      }, 0, function () {
        $(li).animate({
          opacity: 0
        }, 300, function () {
          li.remove();
          deleteData(span1.innerText);
          saveData();
          result();
        });
      });
    });


    // Editボタン押されたら、そのリストを編集（Editボタンとマイナスボタンを削除し、Doneボタンを表示）
    // edit.addEventListener('click', function () {
    //   li.classList.toggle('text-decoration-line-through');
    //   li.classList.toggle('list-group-item-dark');
    //   done.style.display = 'block';
    //   // edit.style.display = 'none';

    //   console.log(todo.text);
    //   li.innerHTML = '<label>' + done + '<input type="text" id="inputText" class="form-control" placeholder="' + todo.text + '" autocomplete="off"></label>'
    //   $('#inputText').focus();
    //   console.log(todo);


    //   inputText.addEventListener('change', function () {
    //     todo.text = $('#inputText').value;
    //     console.log($('#inputText').value);

    //     $('#inputText').innerHTML = li;
    //     saveData();
    //     result();
    //   })
    // })


    // ul要素の子要素に追加して、input欄をデフォルト状態に戻す
    ul.appendChild(li);
    input.value = '';
    timeStart.value = '';
    timeEnd.value = '';
    saveData();
    result();


    // trashが押されたら、リスト削除(速さを取るため、アニメーション無し)
    trash.addEventListener('click', function () {
      li.remove();
      allDeleteData();
      // saveData();
      trash.style.display = 'none';
      sort.style.display = 'none';
      rate.innerText = '今日のToDoを書き出そう！';
    });


    // sortが押されたら、並び替え（リロード）
    sort.addEventListener('click', function () {
      location.reload();
    });


    // 空白などで入力しようとしたときの制御
  } else {
    window.alert('入力欄エラー');
  }
};


// データ保存
function saveData() {
  const lists = document.querySelectorAll('li');
  let todos = '';
  lists.forEach(list => {
    let todo = {
      text: list.childNodes[3].nodeValue,
      timeStartData: list.childNodes[0].innerText,
      timeEndData: list.childNodes[2].innerText,
      completed: list.classList.contains('text-decoration-line-through')
    };
    todos = todo;
  });
  db.rows.add(
    todos
  ).catch((e) => {
    console.error(e);
  });
};

// DBデータ（１単位）削除
function deleteData(key) {
  db.rows.delete(key).catch((e) => {
    console.log(e);
  });
};


// DBデータ全削除
function allDeleteData() {
  db.rows.clear().catch((e) => {
    console.log(e);
  });
};


//達成率と一言を表示（達成率＝中央線入れたリスト/リストのLength)
function result() {
  const lists = document.querySelectorAll('li');
  let listLength = lists.length;

  let checked = 0;
  for (let i = 0; i < listLength; i++) {
    if (lists[i].classList.contains('text-decoration-line-through')) {
      checked++;
    };

    let num = Math.floor(checked / listLength * 100);
    let doc = '達成率:' + num + '%';

    const com1 = '(天才)';
    const com2 = '(もうちょい！)';
    const com3 = '(良い感じ！)';
    const com4 = '(まだまだだね)';
    const com5 = '(少しずつ！)';
    const com6 = '(こっから！)';

    switch (true) {
      case num >= 100:
        rate.innerText = doc + com1;
        break;
      case num >= 80 && num < 100:
        rate.innerText = doc + com2;
        break;
      case num >= 60 && num < 80:
        rate.innerText = doc + com3;
        break;
      case num >= 40 && num < 60:
        rate.innerText = doc + com4;
        break;
      case num >= 20 && num < 40:
        rate.innerText = doc + com5;
        break;
      case num >= 0 && num < 20:
        rate.innerText = doc + com6;
        break;
    };
  };

  if (listLength === 0) {
    rate.innerText = '今日のToDoを書き出そう！';
    trash.style.display = 'none';
  };
};


// 日付をYYYY/MM/DDの書式で返すメソッド
function formatDate(dt) {
  var y = dt.getFullYear();
  var m = ('00' + (dt.getMonth() + 1)).slice(-2);
  var d = ('00' + dt.getDate()).slice(-2);
  return (y + '/' + m + '/' + d);
};