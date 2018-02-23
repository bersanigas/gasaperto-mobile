
const host = "http://localhost:8080";

/*********** FUNZIONE DI AUTENTICAZIONE ***********/
function checkAuthentication() {
	var cn = "Authorization=";
	var idx = document.cookie.indexOf(cn)

	if (idx != -1) {
		var end = document.cookie.indexOf(";", idx + 1);
		if (end == -1) end = document.cookie.length;
		return unescape(document.cookie.substring(idx + cn.length, end));
	} else {
		return "KO";
	}
}

function login(gUser, gPass) {
	$.ajax({
		url: host + '/gas/api/auth/authentication.php',
		type: "POST",
		data: {
			user: gUser,
			pass: gPass
		},
		success: function(res) {
			if (res.Status == "KO") {
				$("#spanMsgErrCred").html("Credenziali errate o utenza non valida.");
				$("#divErrCred").show();
			} else {
				// Memorizzo credenziali nel cookie
				var header = "Basic " + btoa($("#inputEmail").val() + ":" + $("#inputPassword").val());
				document.cookie = "Authorization=" + header;
				window.location.href = 'index.html';
			}
		}
	});
}

function logOut() {
	var cn = "Authorization=";
	var idx = document.cookie.indexOf(cn)

	if (idx != -1) {
		var end = document.cookie.indexOf(";", idx + 1);
		if (end == -1) end = document.cookie.length;
		var nameCookie = document.cookie.substring(idx + cn.length, end);
		document.cookie = cn + nameCookie + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
		return true;
	}
	return false;
}

/*********** FUNZIONI GESTIONE ORDINI ***********/
function getOrdiniAperti() {
	$.ajax({
		url: host + '/gas/api/ordini/read.php',
		contentType: "application/json; charset=utf-8",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Authorization", checkAuthentication());
		},
		dataType: "json",
		success: function(res) {
			if (res.Message != undefined && res.Message.length > 0) {
				$("#spanMsgOrdini").html(res.Message);
				$("#divInfoOrdini").show();
			} else {
				for (var i=0; i < res.records.length; i++) {
					var obj = res.records[i];
					var html = "<div class='col-lg-4 col-md-6 mb-4'>" +
						"<div class='card h-100'>" +
							"<div class='card-body'>" + 
								"<h4 class='card-title'>" +
									"<a href='#'>" + obj.ditta + "</a>" +
								"</h4>" +
								"<h5>&#8364; " + obj.saldoUtenteOrdine + "</h5>" + 
								"<p class='card-text'> Data apertura: " + obj.dataApertura + 
								"<br> Data chiusura: " + obj.dataChiusura +
								"<hr>" +
								"<small>" + obj.msg_apertura + "</small>" +
								"</p>" +
							"</div>" + 
							"<div class='card-footer'>" +
							  "<small class='text-muted'>Gestore: " + obj.cognomeGestore + " " + obj.nomeGestore + 
							  "<br> (<a href='mailto:" + obj.emailGestore + "'>" + obj.emailGestore  +"</a>) </small>" +
							"</div>" +
						"</div>" +
					"</div>"
					
					$("#divRow").append(html);
				}
				
			}
		}
	});
}

