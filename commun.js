/* ClaimAI : libellés métier et utilitaires partagés */
(function (g) {
  "use strict";
  var API_DEFAUT = "https://okugbnabvlotasdsokco.supabase.co/functions/v1/claimai";
  // Adresse et clé publique du service de connexion : faites pour être visibles dans le navigateur
  var SUPABASE_URL = "https://okugbnabvlotasdsokco.supabase.co";
  var CLE_PUBLIQUE = "sb_publishable_ybKkc2FMkcVCBkJI50RAIQ_X6sCEPe4";

  var STATUTS = {
    recu: ["Reçu", "encours"], analyse: ["Analysé", "encours"], contrat_verifie: ["Contrat vérifié", "encours"],
    hors_perimetre: ["À reprendre", "vous"], decision_a_valider: ["Décision à valider", "vous"],
    refuse: ["Refusé", "ko"], mission_envoyee: ["Mission en cours", "encours"], attente_pieces: ["Attente de pièces", "encours"],
    expertise_recue: ["Retour reçu", "encours"], anomalie_gestionnaire: ["Anomalie à examiner", "vous"],
    prereglement_a_valider: ["Règlement à valider", "vous"], reglement_envoye: ["Virement en cours", "encours"],
    clos: ["Clos et payé", "ok"], classe_sans_suite: ["Classé", "neutre"]
  };
  var THEMES = {
    BRIS_GLACE: "Bris de glace", PERTE_CONTROLE_OBSTACLE_FIXE: "Perte de contrôle", VANDALISME: "Vandalisme",
    GARANTIE_ACCIDENT: "Garantie Accident", AUTRE: "Autre sinistre", NON_QUALIFIE: "Non qualifié"
  };
  var MOTIFS = {
    garantie_non_souscrite: "La garantie nécessaire n'est pas souscrite",
    contrat_non_actif_a_la_date: "Le contrat n'était pas en vigueur à la date du sinistre",
    contrat_introuvable: "Aucun contrat ne correspond au numéro déclaré",
    theme_non_gere: "Type de sinistre non couvert par le circuit",
    theme_hors_perimetre: "Sinistre hors du circuit automatique",
    tiers_implique: "Un tiers est impliqué : responsabilité à établir",
    tiers_non_determine: "La présence d'un tiers n'est pas établie",
    analyse_incertaine: "Récit ambigu : l'analyse est peu sûre",
    theme_declare_incoherent: "Le type déclaré ne correspond pas au récit",
    doublon_possible: "Un dossier identique existe déjà",
    analyse_ia_en_echec: "L'analyse automatique n'a pas abouti",
    aucun_reparateur_agree: "Aucun réparateur agréé dans la zone",
    aucun_expert_zone: "Aucun expert disponible dans le département",
    anomalie_expertise: "Écart relevé sur l'expertise ou la facture",
    calcul_impossible: "Le calcul du règlement est impossible",
    prereglement_a_valider: "Règlement calculé, à valider",
    prereglement_rejete: "Règlement rejeté par un gestionnaire",
    traitement_manuel: "Dossier en traitement manuel",
    relances_sans_reponse: "Trois relances sans réponse",
    qualite_assure_a_verifier: "Âge ou lien de la victime à vérifier",
    aipp_inferieure_10: "Atteinte estimée sous le seuil de 10 %",
    age_limite_75: "Victime de 75 ans ou plus",
    rente_viagere_service_rentes: "AIPP de 50 % ou plus : rente viagère, service Rentes",
    AT_PUR: "Accident du travail", ALCOOL_VTM: "Alcoolémie au volant", STUPEFIANTS_VTM: "Stupéfiants au volant",
    REFUS_DEPISTAGE: "Refus de dépistage", RIXE: "Participation à une rixe", DELIT_INTENTIONNEL: "Délit intentionnel",
    SPORTS_AERIENS: "Sport aérien", ACROBATIES_MOTORISEES: "Acrobaties motorisées", SPORT_MOTEUR_FEDERATION: "Sport motorisé en club",
    TENTATIVE_SUICIDE: "Tentative de suicide", ACTE_THERAPEUTIQUE: "Acte thérapeutique"
  };
  var ANOMALIES = {
    VEI: "Véhicule économiquement irréparable",
    REGLEMENT_DIRECT_REFUSE: "L'expert n'accorde pas le règlement direct au réparateur",
    TAUX_HORAIRE: "Taux horaire au-dessus du maximum", ECART_DEVIS: "Écart entre le devis et le montant retenu",
    PLAFOND_DEPASSE: "Plafond de garantie dépassé", SEUIL_SANS_EXPERT: "Montant au-dessus du seuil sans expertise",
    INCOHERENCE_CHIFFRAGE: "Chiffrage incohérent", ECART_FACTURE_EXPERTISE: "Facture au-dessus du montant de l'expert",
    ECART_BAREME: "AIPP éloignée du barème", CONSOLIDATION_MANQUANTE: "Date de consolidation absente",
    CONSOLIDATION_INCOHERENTE: "Date de consolidation incohérente", DEPENDANCE_TOTALE: "Dépendance totale signalée",
    AUCUN_REPARATEUR: "Aucun réparateur agréé trouvé", AUCUN_EXPERT: "Aucun expert trouvé",
    RELANCES_SANS_REPONSE: "Trois relances sans réponse", CALCUL_IMPOSSIBLE: "Calcul impossible"
  };
  var COURRIERS = {
    accuse_reception: "Prise en charge", refus: "Refus", mission_expert: "Mission d'expertise",
    prise_en_charge_garage: "Ordre de réparation", demande_pieces: "Demande de pièces", relance: "Relance",
    avis_reglement: "Avis de règlement", information: "Information", classement: "Classement"
  };
  var ROLES = { assure: "Assuré", expert: "Expert", garage: "Réparateur", expert_auto: "Expert automobile", expert_medical: "Médecin expert" };
  var PIECES = {
    FACTURE: "Facture", DELEGATION_PAIEMENT: "Délégation de paiement", RAPPORT_EXPERTISE: "Rapport d'expertise",
    DEPOT_PLAINTE: "Récépissé de plainte", CMI: "Certificat médical initial", FICHE_RENSEIGNEMENTS: "Fiche de renseignements",
    RIB: "RIB", RAPPORT_MEDICAL: "Conclusions médicales"
  };
  var LIENS = { societaire: "Sociétaire", conjoint: "Conjoint", enfant_mineur: "Enfant mineur", enfant_etudiant: "Enfant étudiant",
    enfant_handicape: "Enfant en situation de handicap", personne_a_charge: "Personne à charge", conducteur_tiers: "Conducteur autorisé" };
  var CLASSES = { AS: "Vie privée (AS)", AW: "Circulation (AW)", AT: "Travail (AT)" };

  function $(id) { return document.getElementById(id); }
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var EUR = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  function eur(n) { return n == null || n === "" ? "" : EUR.format(Number(n)); }
  function nombre(n, d) { return n == null ? "" : Number(n).toLocaleString("fr-FR", { maximumFractionDigits: d == null ? 2 : d }); }
  function dateFr(s) { if (!s) return ""; var d = new Date(String(s).length <= 10 ? s + "T12:00:00" : s); return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); }
  function dateCourte(s) { if (!s) return ""; var d = new Date(String(s).length <= 10 ? s + "T12:00:00" : s); return d.toLocaleDateString("fr-FR"); }
  function heure(s) { if (!s) return ""; var d = new Date(s); return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + ", " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); }
  function depuis(s) {
    if (!s) return ""; var m = Math.round((Date.now() - new Date(s).getTime()) / 60000);
    if (m < 1) return "à l'instant"; if (m < 60) return "il y a " + m + " min";
    var h = Math.round(m / 60); if (h < 24) return "il y a " + h + " h"; var j = Math.round(h / 24); return "il y a " + j + " j";
  }
  function statut(s) { var x = STATUTS[s] || [s || "?", ""]; return '<span class="statut ' + x[1] + '">' + esc(x[0]) + "</span>"; }
  function theme(t) { return THEMES[t] || t || "Non qualifié"; }
  function motif(m) { return MOTIFS[m] || m || ""; }
  function attendVous(s) { return (STATUTS[s] || [])[1] === "vous"; }

  var minuteur;
  function toast(msg, erreur) {
    var t = $("toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.className = "toast" + (erreur ? " erreur" : ""); t.hidden = false;
    clearTimeout(minuteur); minuteur = setTimeout(function () { t.hidden = true; }, erreur ? 6500 : 3500);
  }
  function occupe(btn, oui, libelle) {
    if (!btn) return;
    if (oui) { btn.dataset.l = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="tourne" aria-hidden="true"></span> ' + esc(libelle || "Patientez"); }
    else { btn.disabled = false; if (btn.dataset.l) btn.innerHTML = btn.dataset.l; }
  }

  // auth : la clé de la compagnie (outil de l'assureur) ou une fonction qui rend le jeton de session du gestionnaire
  // auth : clé API (texte) ou fonction qui rend le jeton de session ;
  // entetes : fonction facultative qui rend des en-têtes en plus (ex. environnement d'essai)
  function client(base, auth, entetes) {
    return function (chemin, opts) {
      opts = opts || {};
      var jeton = typeof auth === "function" ? Promise.resolve(auth()) : Promise.resolve(null);
      return jeton.then(function (j) {
        var h = typeof entetes === "function" ? (entetes() || {}) : {};
        if (typeof auth === "string" && auth) h["x-claimai-key"] = auth;
        if (j) h["Authorization"] = "Bearer " + j;
        if (opts.body !== undefined) h["Content-Type"] = "application/json";
        return fetch(String(base).replace(/\/+$/, "") + "/" + chemin, {
          method: opts.method || (opts.body !== undefined ? "POST" : "GET"), headers: h,
          body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined
        }).then(function (r) {
          return r.text().then(function (t) {
            var d = null; try { d = t ? JSON.parse(t) : null; } catch (e) { }
            if (!r.ok) { var err = new Error((d && d.erreur) || ("Erreur " + r.status)); err.status = r.status; err.requete = d && d.requete; throw err; }
            return d;
          });
        }, function () { throw new Error("Service injoignable. Vérifiez votre connexion."); });
      });
    };
  }

  var SESSION = "claimai-gestion-v1";
  function lireSession() { try { return JSON.parse(localStorage.getItem(SESSION) || "null"); } catch (e) { return null; } }
  function ecrireSession(s) { try { localStorage.setItem(SESSION, JSON.stringify(s)); } catch (e) { } }
  function oublierSession() { try { localStorage.removeItem(SESSION); } catch (e) { } }

  var LOGO = '<svg width="24" height="24" viewBox="0 0 26 26" aria-hidden="true"><rect x="1" y="1" width="24" height="24" rx="6" fill="#2563EB"/><path d="M7.5 9h11M7.5 13h11M7.5 17h6.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';

  g.CA = {
    API_DEFAUT: API_DEFAUT, SUPABASE_URL: SUPABASE_URL, CLE_PUBLIQUE: CLE_PUBLIQUE, STATUTS: STATUTS, THEMES: THEMES, MOTIFS: MOTIFS, ANOMALIES: ANOMALIES, COURRIERS: COURRIERS,
    ROLES: ROLES, PIECES: PIECES, LIENS: LIENS, CLASSES: CLASSES, LOGO: LOGO,
    $: $, esc: esc, eur: eur, nombre: nombre, dateFr: dateFr, dateCourte: dateCourte, heure: heure, depuis: depuis,
    statut: statut, theme: theme, motif: motif, attendVous: attendVous, toast: toast, occupe: occupe, client: client,
    lireSession: lireSession, ecrireSession: ecrireSession, oublierSession: oublierSession
  };
})(window);
