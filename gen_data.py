# IBMap company database
# lat/lng are only set for companies with verified office addresses.
# Companies without coordinates appear in the table view only (not on map).
# Categories use full names: "Asset Management", "Hedge Fund", etc.

companies_data = [
  # ── Asset Management ─────────────────────────────────────────────────────────
  ("adrigo","Adrigo","Asset Management","https://www.adrigo.se/en","Stockholm","Sweden",59.3351,18.0726,"Boutique Nordic asset manager with a long/short equity overlay.",None,None,True),
  ("alfred-berg","Alfred Berg","Asset Management","https://www.alfredberg.no/","Oslo","Norway",59.911,10.7238,"Leading Nordic asset manager with a long history in Norwegian markets.",None,None,False),
  ("amundsen-im","Amundsen Investment Management","Asset Management","https://amundsen-im.com/","Oslo","Norway",59.9125,10.7266,"Boutique Norwegian asset manager focused on equity strategies.",None,None,False),
  ("anna-fund","Anna Fund","Asset Management","https://www.anna.fund/","Oslo","Norway",None,None,"Nordic fund manager with a focus on sustainable investments.",None,None,False),
  ("arctic-am","Arctic Asset Management","Asset Management","https://www.arctic.com/aam","Oslo","Norway",59.9138,10.7312,"Part of the Arctic Securities group, specialising in Norwegian and Nordic markets.",None,None,False),
  ("blueberry-capital","Blueberry Capital","Asset Management","https://blueberry.no/","Oslo","Norway",None,None,"Norwegian asset manager focused on equity strategies.",None,None,False),
  ("borea-am","Borea Asset Management","Asset Management","https://borea.no/","Bergen","Norway",60.3924,5.3218,"Bergen-based independent asset manager specialising in fixed income and equities.","~NOK 6bn",None,False),
  ("cworldwide","C WorldWide Asset Management","Asset Management","http://www.cworldwide.com/no/","Oslo","Norway",59.9118,10.7259,"Global asset manager with Nordic focus and offices in Oslo.",None,None,False),
  ("danske-invest","Danske Invest Asset Management","Asset Management","https://danskeinvest.no","Oslo","Norway",None,None,"Part of Danske Bank Group, managing funds distributed in Norway.",None,None,True),
  ("dnb-am","DNB Asset Management","Asset Management","https://dnbam.com/en","Oslo","Norway",59.9076,10.7601,"Norway's largest bank's asset management arm.","~NOK 900bn","200+",False),
  ("duvi","Duvi","Asset Management","https://duvi.no","Lillestrøm","Norway",59.9578,11.05,"Norwegian boutique asset manager based in Lillestrøm.",None,None,False),
  ("eika-kapital","Eika Kapitalforvaltning","Asset Management","https://eika.no","Oslo","Norway",59.9144,10.7212,"Asset management arm of the Eika savings bank cooperative, managing funds for retail investors.","~NOK 35bn",None,False),
  ("equinor-am","Equinor Asset Management","Asset Management","https://www.equinorfondene.no/","Stavanger","Norway",58.8928,5.7191,"In-house asset management arm of Equinor.",None,None,False),
  ("first-fondene","First Fondene","Asset Management","https://www.firstfondene.no/","Oslo","Norway",59.911,10.7238,"Norwegian asset manager offering equity and balanced funds.",None,None,False),
  ("folketrygdfondet","Folketrygdfondet","Asset Management","https://www.folketrygdfondet.no/","Oslo","Norway",59.9129,10.7263,"Government-owned fund manager for the Government Pension Fund Norway.","~NOK 340bn",None,False),
  ("fondsfinans","Fondsfinans","Asset Management","https://www.fondsfinans.no/","Oslo","Norway",59.9129,10.7311,"Norwegian securities firm offering asset management and equity research.",None,None,False),
  ("fondsforvaltning","Fondsforvaltning","Asset Management","https://www.fondsforvaltning.no/","Oslo","Norway",None,None,"Norwegian asset management company.",None,None,False),
  ("gabler","Gabler Investments","Asset Management","https://gabler.no/","Oslo","Norway",None,None,"Norwegian investment advisor and fund manager.",None,None,False),
  ("handelsbanken","Handelsbanken Fonder","Asset Management","http://www.handelsbanken.no/fond","Oslo","Norway",59.9082,10.7219,"Swedish bank with a strong Norwegian asset management presence.",None,None,True),
  ("heimdal","Heimdal Forvaltning","Asset Management","https://heimdalfondene.no/","Stavanger","Norway",58.9731,5.7226,"Stavanger-based Norwegian fund manager focused on equity markets.",None,None,False),
  ("holberg","Holberg Fondene","Asset Management","https://www.holberg.no/","Bergen","Norway",60.3847,5.3321,"Independent Bergen-based asset manager with strong track record in Nordic equities.",None,"30-60",False),
  ("klp","KLP Kapitalforvaltning","Asset Management","https://www.klp.no/","Oslo","Norway",59.9089,10.7248,"Norway's largest pension fund and life insurance company, known for ESG leadership.","~NOK 900bn","1000+",False),
  ("kraftfinans","Kraft Finans","Asset Management","https://kraftfinans.no/en/","Sandnes","Norway",58.8697,5.7173,"Norwegian asset manager based in Sandnes, specialising in power and energy.",None,None,False),
  ("landkreditt","Landkreditt Forvaltning","Asset Management","https://www.landkredittforvaltning.no/","Oslo","Norway",None,None,"Asset manager affiliated with the agricultural credit cooperative Landkreditt.",None,None,False),
  ("nordea-am","Nordea Asset Management","Asset Management","https://www.nordeaassetmanagement.com/","Oslo","Norway",59.9288,10.71,"One of the largest asset managers in the Nordics, part of the Nordea Group.","~EUR 250bn",None,True),
  ("nbim","Norges Bank Investment Management","Asset Management","https://www.nbim.no/","Oslo","Norway",59.9086,10.7424,"Manages Norway's Government Pension Fund Global — the world's largest sovereign wealth fund.","~USD 1.7 trillion","600+",False),
  ("norges-investor","NorgesInvestor","Asset Management","https://www.norgesinvestor.no/","Oslo","Norway",59.9127,10.7294,"Norwegian investment management platform.",None,None,False),
  ("norse-forvaltning","Norse Forvaltning","Asset Management","https://www.norseforvaltning.no/","Oslo","Norway",None,None,"Norwegian boutique asset manager.",None,None,False),
  ("northern-trust","Northern Trust Norway","Asset Management","https://www.northerntrust.com/norway","Oslo","Norway",59.9134,10.7307,"Global custodian and asset manager with a Norwegian branch in Vika.",None,None,True),
  ("nrp-maritime","NRP Maritime Asset Management","Asset Management","https://www.nrp.no/mam/","Oslo","Norway",None,None,"Specialist in maritime and offshore investments.",None,None,False),
  ("nykredit-am","Nykredit Asset Management","Asset Management","https://www.nykredit.com","Copenhagen","Denmark",None,None,"Asset management arm of Danish mortgage bank Nykredit, managing credit and equity strategies.",None,None,True),
  ("odin","ODIN Forvaltning","Asset Management","https://odinfond.no/","Oslo","Norway",59.919,10.7195,"Long-established Nordic equity fund manager with a value investing heritage.",None,"40-80",False),
  ("pareto-am","Pareto Asset Management","Asset Management","https://paretoam.com/en","Oslo","Norway",59.9127,10.7294,"Part of the Pareto Group, one of Norway's leading independent financial services firms.",None,None,False),
  ("req","REQ Capital","Asset Management","https://req.no/","Oslo","Norway",59.915,10.7178,"Norwegian asset manager with a concentrated, high-conviction equity approach.",None,None,False),
  ("salt-capital","Salt Capital","Asset Management","https://saltcapital.no/","Stavanger","Norway",58.9698,5.7326,"Norwegian ETF provider and quantitative asset manager.",None,None,False),
  ("storebrand-am","Storebrand Asset Management","Asset Management","https://www.storebrandam.com/en-gb/","Lysaker","Norway",59.9126,10.6351,"Leading Nordic asset manager in ESG investing. Part of Storebrand Group.","~NOK 1 trillion","200+",False),
  ("valhalla-capital","Valhalla Capital","Asset Management","https://valhallacapital.no/","Oslo","Norway",None,None,"Norwegian asset management firm.",None,None,False),
  ("mandatum-am","Mandatum Asset Management","Asset Management","https://www.mandatum.com","Helsinki","Finland",None,None,"Finnish insurer-backed asset manager offering a range of investment solutions.",None,None,True),
  ("agenta","Agenta","Asset Management","https://www.agenta.se","Stockholm","Sweden",None,None,"Swedish boutique asset manager offering multi-asset and fixed income strategies.",None,None,True),
  ("lansforsakringar","Länsförsäkringar Fondförvaltning","Asset Management","https://www.lansforsakringar.se","Stockholm","Sweden",None,None,"Asset management arm of the Swedish Länsförsäkringar insurance group.",None,None,True),
  # ── Hedge Fund ──────────────────────────────────────────────────────────────
  ("carn-capital","CARN Capital","Hedge Fund","https://carncapital.com/en/","Oslo","Norway",None,None,"Norwegian specialist in Nordic equities with a long/short strategy.",None,None,False),
  ("protean-funds","Protean Funds","Hedge Fund","https://www.proteanfunds.com/","Stockholm","Sweden",59.3333,18.0723,"Nordic investment firm running a concentrated long/short equity strategy.",None,None,True),
  ("sector-am","Sector Asset Management","Hedge Fund","https://sector.no/","Bergen","Norway",60.3939,5.3245,"Bergen-based manager known for the Sector Zen Fund, a Nordic fixed income hedge fund.",None,None,False),
  ("storm-capital","Storm Capital Management","Hedge Fund","https://stormcapital.no/","Oslo","Norway",None,None,"Norwegian long/short equity hedge fund with a Nordic focus.",None,None,False),
  ("svelland","Svelland Capital","Hedge Fund","https://www.svelland.com/","Oslo","Norway",59.9138,10.7312,"Oslo-based commodity macro hedge fund focused on energy, shipping, and metals.",None,None,False),
  ("taiga-fund","Taiga Fund","Hedge Fund","https://www.taigafund.no/","Oslo","Norway",None,None,"Norwegian long/short equity fund with a concentrated Nordic portfolio.",None,None,False),
  ("tind-am","Tind Asset Management","Hedge Fund","https://tindam.com/","Oslo","Norway",None,None,"Norwegian manager running the TIND Discovery Fund, a concentrated Nordic long/short strategy.",None,None,False),
  # Norwegian hedge funds from HedgeNordic
  ("sissener","Sissener AS","Hedge Fund","https://www.sissener.no/","Oslo","Norway",None,None,"Jan Petter Sissener's Oslo-based hedge fund management company, running Sissener Canopus.",None,None,False),
  ("nordkinn","Nordkinn Asset Management","Hedge Fund","https://www.nordkinn.no/","Oslo","Norway",None,None,"Norwegian specialist fixed-income macro hedge fund manager.",None,None,False),
  ("norselab","Norselab","Hedge Fund","https://www.norselab.no/","Oslo","Norway",None,None,"Norwegian alternative investment manager focused on credit and real estate strategies.",None,None,False),
  ("oceanic-am","Oceanic Hedge Fund","Hedge Fund","https://www.oceanicinvestment.no/","Oslo","Norway",None,None,"Norwegian hedge fund investing globally with a macro and systematic approach.",None,None,False),
  ("asgard-capital","Asgard Capital Management","Hedge Fund","https://www.asgardcapital.no/","Oslo","Norway",None,None,"Norwegian fixed-income hedge fund manager running the Asgard Fixed Income strategies.",None,None,False),
  ("caba-capital","CABA Capital","Hedge Fund","https://www.caba.no/","Oslo","Norway",None,None,"Norwegian alternative investment manager running CABA Hedge and flexible fixed-income strategies.",None,None,False),
  ("fenja-capital","Fenja Capital","Hedge Fund","https://www.fenjacapital.no/","Oslo","Norway",None,None,"Norwegian hedge fund manager focused on Nordic equities.",None,None,False),
  ("nidaros-capital","Nidaros Capital","Hedge Fund","https://www.nidaroscapital.no/","Trondheim","Norway",None,None,"Trondheim-based equity hedge fund manager.",None,None,False),
  ("gersemi-am","Gersemi Asset Management","Hedge Fund","https://www.gersemi.com/","Oslo","Norway",None,None,"Norwegian alternative asset manager specialising in the shipping sector.",None,None,False),
  ("agmentum","Agmentum Asset Management","Hedge Fund","https://www.agmentum.com/","Oslo","Norway",None,None,"Norwegian hedge fund focused on maritime and shipping strategies.",None,None,False),
  ("proxy-pr","Proxy P&R","Hedge Fund","https://www.proxype.com/","Oslo","Norway",None,None,"Norwegian fund running Proxy Renewable Long/Short Energy, focusing on the energy transition.",None,None,False),
  # Swedish hedge funds from HedgeNordic
  ("brummer","Brummer & Partners","Hedge Fund","https://www.brummer.se/","Stockholm","Sweden",59.3333,18.0724,"One of Sweden's largest hedge fund managers, running the Brummer Multi-Strategy flagship fund.","~SEK 100bn",None,True),
  ("alcur","Alcur Fonder","Hedge Fund","https://www.alcur.se/","Stockholm","Sweden",None,None,"Stockholm-based long/short equity hedge fund manager focused on Nordic small and mid cap.",None,None,True),
  ("atlant","Atlant Fonder","Hedge Fund","https://www.atlantfonder.se/","Stockholm","Sweden",None,None,"Stockholm-based alternative fund house managing a range of hedge and structured strategies.",None,None,True),
  ("lynx-am","Lynx Asset Management","Hedge Fund","https://www.lynxhedge.se/","Stockholm","Sweden",None,None,"Swedish systematic CTA hedge fund, one of the largest in the Nordics.","~SEK 30bn",None,True),
  ("norron","Norron Fonder","Hedge Fund","https://www.norron.se/","Stockholm","Sweden",None,None,"Stockholm-based manager running Nordic long/short equity and multi-strategy hedge funds.",None,None,True),
  ("rhenman","Rhenman & Partners","Hedge Fund","https://www.rhenmanpartners.se/","Stockholm","Sweden",None,None,"Swedish specialist healthcare long/short equity manager.",None,None,True),
  ("rpm","RPM Risk & Portfolio Management","Hedge Fund","https://www.rpmfunds.se/","Stockholm","Sweden",None,None,"Swedish systematic CTA and risk premia specialist.",None,None,True),
  ("tidan","Tidan Capital","Hedge Fund","https://www.tidancapital.com/","Stockholm","Sweden",None,None,"Stockholm-based multi-strategy hedge fund manager.",None,None,True),
  ("priornilsson","PriorNilsson Fonder","Hedge Fund","https://www.priornilsson.se/","Stockholm","Sweden",None,None,"Swedish fund manager offering long/short equity and balanced strategies.",None,None,True),
  ("r2-capital","R2 Capital Group","Hedge Fund","https://www.r2capital.se/","Stockholm","Sweden",None,None,"Swedish fixed-income hedge fund manager.",None,None,True),
  ("coeli-am","Coeli Asset Management","Hedge Fund","https://www.coeli.se/","Stockholm","Sweden",None,None,"Swedish wealth and alternative investment manager offering a range of hedge and credit strategies.",None,None,True),
  ("accendo","Accendo Capital","Hedge Fund","https://www.accendocapital.com/","Stockholm","Sweden",None,None,"Stockholm-based activist and event-driven hedge fund manager focused on Nordic equities.",None,None,True),
  ("excalibur-fm","Excalibur Fund Management","Hedge Fund","https://www.excaliburfm.se/","Stockholm","Sweden",None,None,"Swedish fixed-income relative value hedge fund manager.",None,None,True),
  ("origo-fonder","Origo Fonder","Hedge Fund","https://www.origofonder.se/","Stockholm","Sweden",None,None,"Stockholm-based long/short equity manager, known for Origo Quest.",None,None,True),
  ("elementa","Elementa Management","Hedge Fund","https://www.elementafonder.se/","Stockholm","Sweden",None,None,"Swedish multi-strategy fund manager.",None,None,True),
  ("case-am","Case Asset Management","Hedge Fund","https://www.casefonder.se/","Stockholm","Sweden",None,None,"Swedish fixed-income and credit-focused hedge fund manager.",None,None,True),
  ("meriti","Meriti Carlsson Norén","Hedge Fund","https://www.meritifonder.se/","Stockholm","Sweden",None,None,"Swedish macro and rates-focused alternative investment manager.",None,None,True),
  # Danish hedge funds from HedgeNordic
  ("capital-four","Capital Four","Hedge Fund","https://www.capital-four.com/","Copenhagen","Denmark",None,None,"Danish credit-focused alternative investment manager, specialising in high yield and leveraged loans.","~EUR 10bn",None,True),
  ("formuepleje","Formuepleje","Hedge Fund","https://www.formuepleje.dk/","Copenhagen","Denmark",None,None,"Danish alternative asset manager known for leveraged multi-asset strategies.",None,None,True),
  ("othania","Othania Fondsmæglerselskab","Hedge Fund","https://www.othania.dk/","Copenhagen","Denmark",None,None,"Danish multi-strategy alternative fund manager.",None,None,True),
  ("thyra","Thyra Fondene","Hedge Fund","https://www.thyra.dk/","Copenhagen","Denmark",None,None,"Danish long/short equity hedge fund manager focused on Nordic stocks.",None,None,True),
  # Finnish hedge funds from HedgeNordic
  ("estlander","Estlander & Partners","Hedge Fund","https://www.estlander.com/","Helsinki","Finland",None,None,"One of the oldest Nordic CTAs, running systematic trend-following strategies since 1991.",None,None,True),
  ("hcp","Helsinki Capital Partners","Hedge Fund","https://www.hcp.fi/","Helsinki","Finland",None,None,"Finnish long/short equity hedge fund manager with a Nordic focus.",None,None,True),
  # ── Holding ──────────────────────────────────────────────────────────────────
  ("arendals-fossekompani","Arendals Fossekompani","Holding","https://arendalsfossekompani.no/en/","Arendal","Norway",58.4678,8.7943,"Industrial investment company focused on energy, technology, and aquaculture.",None,None,False),
  ("kistefos","Kistefos","Holding","https://kistefos.no/","Oslo","Norway",59.9105,10.7285,"Investment company owned by Christen Sveaas, investing in listed and unlisted companies.","~NOK 15bn",None,False),
  # ── Investment Banking ────────────────────────────────────────────────────────
  ("abg","ABG Sundal Collier","Investment Banking","https://www.abgsc.com/","Oslo","Norway",59.911,10.7238,"One of the leading Nordic investment banks, with expertise in oil & gas, seafood, and technology.",None,"300+",False),
  ("jpmorgan-oslo","J.P. Morgan Oslo","Investment Banking","https://www.jpmorgan.com/","Oslo","Norway",59.9138,10.7312,"Global investment bank with an Oslo branch serving Nordic institutional clients.",None,None,True),
  ("nordnet","Nordnet","Investment Banking","https://www.nordnet.no/","Oslo","Norway",None,None,"Leading Nordic online brokerage and bank, popular among self-directed investors.","~NOK 25bn AuA",None,True),
  ("seb-oslo","SEB Oslo","Investment Banking","https://www.seb.no/","Oslo","Norway",59.9102,10.7228,"Scandinavian corporate bank with a strong Oslo presence in capital markets and M&A.",None,None,True),
  ("sparebanken-more","Sparebanken Møre","Investment Banking","https://www.sbm.no/","Ålesund","Norway",62.4711,6.154,"Regional Norwegian savings bank based in Ålesund, distributing investment funds.",None,None,False),
  # ── Management Consulting & Advisory ──────────────────────────────────────────
  ("nording-partners","Nording and Partners","Consulting","https://nordingpartners.no/","Oslo","Norway",None,None,"Norwegian financial advisory and management consulting boutique.",None,None,False),
  ("bcg-oslo","BCG Oslo","Consulting","https://www.bcg.com/offices/oslo/default","Oslo","Norway",59.9113,10.7249,"Boston Consulting Group Oslo office. Top-tier strategy consulting with strong financial services practice.",None,"100+",False),
  ("bain-oslo","Bain & Company Oslo","Consulting","https://www.bain.com/offices/oslo/","Oslo","Norway",59.922,10.6855,"Bain & Company Oslo office. Strategy consulting with strong PE due diligence practice.",None,None,False),
  ("mckinsey-oslo","McKinsey Oslo","Consulting","https://www.mckinsey.com/no/overview","Oslo","Norway",59.9102,10.7228,"McKinsey & Company Oslo office. The leading global strategy consulting firm.",None,None,False),
  ("folden-advisory","Folden Advisory","Consulting","https://www.foldenadvisory.com/","Oslo","Norway",None,None,"Norwegian financial advisory boutique.",None,None,False),
  ("accenture-no","Accenture Norway","Consulting","https://www.accenture.com/no-en","Oslo","Norway",59.9102,10.7228,"Global IT and management consulting firm with a large Norwegian operation.","~NOK 2.6bn","1069",False),
  ("deloitte-no","Deloitte Norway","Consulting","https://www2.deloitte.com/no/no.html","Oslo","Norway",59.9084,10.7583,"One of the Big Four professional services firms with a major Norwegian practice.","~NOK 2.7bn","1643",False),
  ("ey-no","EY Norway","Consulting","https://www.ey.com/no_no","Oslo","Norway",59.9087,10.7568,"EY (Ernst & Young) Norway, Big Four advisory, audit, and tax firm.","~NOK 4.2bn","1900",False),
  ("pwc-no","PwC Norway","Consulting","https://www.pwc.no","Oslo","Norway",59.9087,10.756,"PricewaterhouseCoopers Norway, Big Four professional services and advisory firm.","~NOK 3.7bn","2313",False),
  ("kpmg-no","KPMG Norway","Consulting","https://home.kpmg/no/nb/home.html","Oslo","Norway",59.9355,10.686,"Big Four audit, tax, and advisory firm with a large Norwegian practice.","~NOK 2.3bn","1661",False),
  ("bekk","Bekk Consulting","Consulting","https://www.bekk.no/","Oslo","Norway",59.9089,10.722,"Norwegian IT and management consultancy known for high quality and culture.","~NOK 897m","97",False),
  ("capgemini-no","Capgemini Norge","Consulting","https://www.capgemini.com/no-en/","Lysaker","Norway",59.9126,10.6351,"Global IT services and consulting firm with a major Norwegian presence.","~NOK 2.7bn","1555",False),
  ("tieto-evry","TietoEVRY","Consulting","https://www.tietoevry.com/","Lysaker","Norway",59.899,10.628,"Nordic IT services and software company, one of the largest in the region.","~NOK 9.5bn","1141",True),
  ("sopra-steria","Sopra Steria","Consulting","https://www.soprasteria.no/","Oslo","Norway",None,None,"European IT consulting and services group with a significant Norwegian operation.","~NOK 4.5bn","3243",True),
  ("bouvet","Bouvet","Consulting","https://www.bouvet.no/","Oslo","Norway",59.9445,10.7745,"Norwegian IT consultancy known for digital transformation and engineering.","~NOK 2.9bn","2069",False),
  ("bearingpoint-no","BearingPoint Norway","Consulting","https://www.bearingpoint.com/en-no/","Oslo","Norway",59.9132,10.7341,"International management and IT consulting firm with a Norwegian practice.","~NOK 263m","50",False),
  ("kearney-no","Kearney Norway","Consulting","https://www.kearney.com/","Oslo","Norway",59.9138,10.7312,"Global strategy consulting firm, formerly A.T. Kearney, with an Oslo office.",None,None,False),
  ("ramboll-no","Rambøll Norway","Consulting","https://ramboll.com/no","Oslo","Norway",None,None,"Danish engineering and consultancy group with a large Norwegian presence.","~NOK 2.1bn","1391",True),
  ("arkwright-consulting","Arkwright Consulting","Consulting","https://arkwright.no/","Oslo","Norway",None,None,"Norwegian management consulting firm focusing on strategy and organisational change.","~NOK 182m","75",False),
  ("agenda-kaupang","Agenda Kaupang","Consulting","https://agendakaupang.no/","Oslo","Norway",None,None,"Norwegian management and strategy consultancy.",None,None,False),
  # ── Private Equity ──────────────────────────────────────────────────────────
  ("argentum","Argentum","Private Equity","https://argentum.no/","Bergen","Norway",60.3908,5.3222,"Norway's leading PE fund-of-funds investor, backed by the Norwegian government.","~NOK 30bn",None,False),
  ("bluefront","Bluefront Equity","Private Equity","https://bluefrontequity.com/","Oslo","Norway",59.9151,10.7238,"Norwegian PE firm focused on ocean and maritime industries.",None,None,False),
  ("credo-partners","Credo Partners","Private Equity","https://www.credopartners.no/","Oslo","Norway",59.9138,10.7312,"Norwegian mid-market PE firm focused on growth companies.",None,None,False),
  ("cubera","Cubera","Private Equity","https://cubera.no/","Oslo","Norway",59.9211,10.689,"Nordic PE fund-of-funds and secondary investor.",None,None,False),
  ("cvc","CVC Capital Partners","Private Equity","https://www.cvc.com/","Oslo","Norway",None,None,"One of the world's leading PE and investment advisory firms with a Nordic presence.","~EUR 180bn",None,True),
  ("egd-holding","EGD Holding","Private Equity","https://egd.no/","Oslo","Norway",None,None,"Norwegian family-owned investment holding company.",None,None,False),
  ("eqt","EQT Group","Private Equity","https://eqtgroup.com/","Stockholm","Sweden",59.3351,18.0726,"One of the largest PE firms globally with strong Nordic roots.","~EUR 240bn",None,True),
  ("equip-capital","Equip Capital","Private Equity","https://equip.no/","Oslo","Norway",None,None,"Norwegian PE firm focused on growth equity.",None,None,False),
  ("ev-pe","EV Private Equity","Private Equity","https://www.evprivateequity.no/","Stavanger","Norway",58.9727,5.7521,"Stavanger-based PE firm specialising in energy tech and environmental services.",None,None,False),
  ("explore-equity","Explore Equity","Private Equity","https://www.exploreequity.com/","Oslo","Norway",None,None,"Norwegian PE firm investing in Nordic growth companies.",None,None,False),
  ("ferd-capital","Ferd Capital","Private Equity","https://ferd.no/en/capital-en/","Oslo","Norway",59.9085,10.6415,"One of Norway's largest family-owned investment companies (Andresen family).","~NOK 40bn",None,False),
  ("fokus-nordic","Fokus Fund Management Norway","Private Equity","https://fokusnordic.com/","Oslo","Norway",None,None,"Norwegian PE firm targeting Nordic mid-market companies.",None,None,False),
  ("fsn-capital","FSN Capital","Private Equity","https://www.fsncapital.com/en/","Oslo","Norway",59.9129,10.7311,"Nordic PE firm with a strong track record in buyout investments.","~EUR 3bn","30-60",False),
  ("hawk-infinity","Hawk Infinity","Private Equity","https://hawkinfinity.com/","Oslo","Norway",None,None,"Norwegian investment company.",None,None,False),
  ("hitecvision","HitecVision","Private Equity","https://hitecvision.com/","Stavanger","Norway",58.8928,5.7191,"Leading Nordic PE firm specialising in energy and energy technology.","~USD 5bn",None,False),
  ("hg-capital","Hg Capital","Private Equity","https://hgcapital.com/","Oslo","Norway",None,None,"Global PE firm focused on software and technology businesses. Oslo office serves Nordics.","~USD 65bn",None,True),
  ("ik-partners","IK Partners","Private Equity","https://ikpartners.com/","Oslo","Norway",None,None,"Pan-European PE firm with Nordic roots and an Oslo office.","~EUR 14bn",None,True),
  ("jebsen-am","Jebsen Asset Management","Private Equity","https://jebsenassets.com/","Bergen","Norway",60.3942,5.3241,"Family office of the Jebsen family, one of Bergen's most prominent business families.",None,None,False),
  ("longship","Longship","Private Equity","https://www.longship.no/en/","Oslo","Norway",59.9133,10.7415,"Norwegian buyout fund targeting Nordic mid-market companies.",None,None,False),
  ("nordic-capital","Nordic Capital","Private Equity","https://www.nordiccapital.com/","Stockholm","Sweden",59.3331,18.0682,"One of the largest Nordic PE firms, with a focus on healthcare and technology.","~EUR 22bn",None,True),
  ("norfund","Norfund","Private Equity","https://www.norfund.no/","Oslo","Norway",59.9132,10.7341,"Norway's government-owned development finance institution investing in developing countries.","~NOK 30bn",None,False),
  ("norvestor","Norvestor","Private Equity","https://norvestor.com/","Oslo","Norway",59.9138,10.7312,"One of the longest-running Norwegian PE firms, focused on mid-market buyouts.","~EUR 2.5bn",None,False),
  ("play-capital","Play Capital","Private Equity","https://www.playcapital.no/","Oslo","Norway",None,None,"Norwegian investment firm focused on digital media and gaming.",None,None,False),
  ("reiten-co","Reiten & Co","Private Equity","https://reitenco.com/","Oslo","Norway",59.911,10.7531,"Norwegian PE and advisory firm targeting Nordic growth companies.",None,None,False),
  ("summa-equity","Summa Equity","Private Equity","https://summaequity.com/","Oslo","Norway",59.9088,10.7228,"Purpose-driven Nordic PE firm investing in sustainability-themed companies.","~EUR 4bn",None,False),
  ("aera-capital","ARA Capital","Private Equity","https://www.aeracap.com/","Oslo","Norway",None,None,"Norwegian PE firm.",None,None,False),
  ("accelerate-capital","Accelerate Capital","Private Equity","https://www.acceleratecapital.no/","Oslo","Norway",59.9144,10.719,"Norwegian PE firm focused on growth equity investments.",None,None,False),
  # ── Trading ──────────────────────────────────────────────────────────────────
  ("hartree","Hartree Partners","Trading","https://www.hartreepartners.com/","Oslo","Norway",59.9099,10.7227,"Global commodities trading firm with Oslo office for Nordic power and energy markets.",None,None,True),
  ("uniper","Uniper","Trading","https://www.uniper.energy/","Oslo","Norway",None,None,"European energy company with trading operations in Nordic power markets.",None,None,True),
  ("glencore","Glencore","Trading","https://www.glencore.com/","Oslo","Norway",59.9099,10.7227,"One of the world's largest commodity trading companies with Nordic trading operations.",None,None,True),
  ("trafigura","Trafigura","Trading","https://www.trafigura.com/","Oslo","Norway",59.9127,10.7294,"One of the world's largest independent commodity trading companies. Nordic office in Oslo.",None,None,True),
  ("ae-energi","AE Energi","Trading","https://www.aenergi.no/no","Ålesund","Norway",62.4716,6.1607,"Norwegian energy trading company.",None,None,False),
  ("trade-weather-power","Trade Weather Power","Trading","https://www.tradewpower.no/","Oslo","Norway",None,None,"Norwegian power and energy trading firm.",None,None,False),
  # ── Venture Capital ───────────────────────────────────────────────────────────
  ("alliance-ventures","Alliance Ventures","Venture Capital","https://alliance.vc/","Oslo","Norway",None,None,"Renault-Nissan-Mitsubishi Alliance corporate VC arm with Nordic investments.",None,None,False),
  ("antler","Antler","Venture Capital","https://www.antler.co/","Oslo","Norway",59.9102,10.7228,"Global early-stage VC with a strong Oslo presence. Runs a residency program for founders.",None,None,False),
  ("arkwright-x","Arkwright X","Venture Capital","https://arkwrightx.vc/","Oslo","Norway",None,None,"Oslo-based VC arm of Arkwright, investing in early-stage Nordic startups.",None,None,False),
  ("corinthian-vp","Corinthian Venture Partners","Venture Capital","https://www.corinthianvp.com/","Oslo","Norway",None,None,"Norwegian VC firm focused on early-stage technology investments.",None,None,False),
  ("hadean-ventures","Hadean Ventures","Venture Capital","https://hadeanventures.com/","Oslo","Norway",59.9083,10.6981,"Oslo-based VC firm investing in life sciences and medtech.",None,None,False),
  ("herkules","Herkules Capital","Venture Capital","https://www.htgc.com/","Oslo","Norway",None,None,"Norwegian growth equity and VC firm.",None,None,False),
  ("idekapital","Idekapital","Venture Capital","https://idekapital.com/","Oslo","Norway",None,None,"Norwegian VC firm investing in early-stage technology companies.",None,None,False),
  ("investinor","Investinor","Venture Capital","https://investinor.no/","Trondheim","Norway",63.4345,10.4038,"Norwegian government-backed VC fund investing in innovative Norwegian companies.",None,None,False),
  ("katapult","Katapult","Venture Capital","https://katapult.vc/","Oslo","Norway",None,None,"Impact-focused VC firm investing in tech startups solving global challenges.",None,None,False),
  ("pioneer-capital","Pioneer Capital","Venture Capital","https://www.pioneercapital.no/","Oslo","Norway",None,None,"Norwegian early-stage VC firm.",None,None,False),
  ("proventure","ProVenture","Venture Capital","https://www.proventure.no/","Oslo","Norway",None,None,"Norwegian venture firm investing in technology and software companies.",None,None,False),
  ("sandwater","Sandwater","Venture Capital","https://www.sandwater.com/","Oslo","Norway",59.9165,10.7386,"Norwegian VC firm focused on deep tech and software.",None,None,False),
  ("skyfall-ventures","Skyfall Ventures","Venture Capital","https://www.skyfall.vc/","Oslo","Norway",None,None,"Early-stage VC firm investing in Norwegian and Nordic tech startups.",None,None,False),
  ("sno-ventures","Sno Ventures","Venture Capital","https://sno.vc/","Oslo","Norway",None,None,"Norwegian VC firm investing in early-stage Nordic technology companies.",None,None,False),
  ("startuplab-fund","Startuplab Founders Fund","Venture Capital","https://www.startuplab.no/ventures","Oslo","Norway",59.9423,10.7167,"VC arm of Startuplab, the leading Norwegian startup ecosystem hub.",None,None,False),
  ("statkraft-ventures","Statkraft Ventures","Venture Capital","https://www.statkraftventures.com/","Oslo","Norway",59.9154,10.6357,"Corporate VC arm of Statkraft, investing in green energy and climate tech.",None,None,False),
  ("viking-growth","Viking Growth","Venture Capital","https://vikinggrowth.com/","Oslo","Norway",None,None,"Norwegian VC firm supporting Nordic growth companies.",None,None,False),
  # ── Shipping ──────────────────────────────────────────────────────────────────
  ("ssy","SSY","Shipping","https://www.ssyglobal.com/","Oslo","Norway",None,None,"Shipbroking and financial services firm with a strong Oslo presence.",None,None,False),
]

# ── Generate companies.ts ─────────────────────────────────────────────────────
lines = []
for c in companies_data:
    id_, name, cat, web, city, country, lat, lng, desc, aum, emp, nordic = c
    parts = [
        f'  id: "{id_}"',
        f'  name: "{name}"',
        f'  category: "{cat}"',
        f'  website: "{web}"',
        f'  city: "{city}"',
        f'  country: "{country}"',
    ]
    if lat is not None:
        parts.append(f'  lat: {lat}')
    if lng is not None:
        parts.append(f'  lng: {lng}')
    parts.append(f'  description: "{desc}"')
    if aum:
        parts.append(f'  aum: "{aum}"')
    if emp:
        parts.append(f'  employees: "{emp}"')
    if nordic:
        parts.append(f'  isNordic: true')
    lines.append("  {" + ",\n  ".join(parts) + "}")

output = 'import { Company } from "@/types"\n\nexport const companies: Company[] = [\n'
output += ",\n".join(lines)
output += "\n]\n\nexport const FILTER_CATEGORIES = [\n  'ALL',\n  'Asset Management',\n  'Hedge Fund',\n  'Private Equity',\n  'Venture Capital',\n  'Investment Banking',\n  'Trading',\n  'Consulting',\n  'Holding',\n  'Shipping',\n] as const\nexport type FilterCategory = typeof FILTER_CATEGORIES[number]\n"

with open("src/data/companies.ts", "w", encoding="utf-8") as f:
    f.write(output)
print(f"Written {len(companies_data)} companies")
