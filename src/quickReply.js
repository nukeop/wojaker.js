export const replaceQRSubmit = setFile => {
  let QR = window.QR;
  QR.submit = function (e) {
    var t;
    QR.hidePostError(),
      QR.presubmitChecks(e) && (QR.auto = !1,
        QR.xhr = new XMLHttpRequest,
        QR.xhr.open("POST", document.forms.qrPost.action, !0),
        QR.xhr.withCredentials = !0,
        QR.xhr.upload.onprogress = function (e) {
          e.loaded >= e.total ? QR.btn.value = "100%" : QR.btn.value = (0 | e.loaded / e.total * 100) + "%"
        }
        ,
        QR.xhr.onerror = function () {
          QR.xhr = null,
            QR.showPostError("Connection error.")
        }
        ,
        QR.xhr.onload = function () {
          var e, t, a, i, n, o, r;
          if (QR.xhr = null,
            QR.btn.value = "Post",
            200 == this.status) {
            if (e = this.responseText.match(/"errmsg"[^>]*>(.*?)<\/span/))
              return window.passEnabled && /4chan Pass/.test(e) ? QR.onPassError() : QR.resetCaptcha(),
                void QR.showPostError(e[1]);
            (i = this.responseText.match(/<!-- thread:([0-9]+),no:([0-9]+) -->/)) && (n = i[1],
              o = i[2],
              a = (t = $.id("qrFile")) && t.value,
              QR.setPostTime(),
              Config.persistentQR ? ($.byName("com")[1].value = "",
                (t = $.byName("spoiler")[2]) && (t.checked = !1),
                QR.resetCaptcha(),
                (a || QR.painterData) && QR.resetFile(),
                QR.startCooldown()) : QR.close(),
              Main.tid ? (Config.threadWatcher && ThreadWatcher.setLastRead(o, n),
                QR.lastReplyId = +o,
                Parser.trackedReplies[">>" + o] = 1,
                Parser.saveTrackedReplies(n, Parser.trackedReplies)) : ((r = Parser.getTrackedReplies(Main.board, n) || {})[">>" + o] = 1,
                  Parser.saveTrackedReplies(n, r)),
              Parser.touchTrackedReplies(n),
              UA.dispatchEvent("4chanQRPostSuccess", {
                threadId: n,
                postId: o
              })),
              ThreadUpdater.enabled && setTimeout(ThreadUpdater.forceUpdate, 500)
          } else
            QR.showPostError("Error: " + this.status + " " + this.statusText)
        }
        ,
        !(t = new FormData(document.forms.qrPost)).entries || !t["delete"] || t.get("upfile") && t.get("upfile").size || t["delete"]("upfile"),
        QR.painterData && (QR.appendPainter(t),
          QR.replayBlob && t.append("oe_replay", QR.replayBlob, "tegaki.tgkr"),
          t.append("oe_time", QR.painterTime),
          QR.painterSrc && t.append("oe_src", QR.painterSrc)),
        clearInterval(QR.pulse),
        QR.btn.value = "Sending",
        setFile(t),
        QR.xhr.send(t))
  }
}