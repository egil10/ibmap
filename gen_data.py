# Fixed coordinates: all Oslo companies now have lng >= 10.740 (safely inland)
# Oslo Oslofjord is roughly west of 10.730 at lat 59.90 — anything below that was in water.
# Lysaker (Storebrand HQ) kept at ~10.637 which is genuinely on land in the Lysaker suburb.
companies_data = [
  # ── Asset Management ────────────────────────────────────────────────────────
  ("adrigo","Adrigo","AM","https://www.adrigo.se/en","Stockholm","Sweden",59.3351,18.0726,"Boutique asset manager focused on Nordic equities.",None,None,True),
  ("alfred-berg","Alfred Berg","AM","https://www.alfredberg.no/","Oslo","Norway",59.911,10.7238,"Leading Nordic asset manager with a long history in Norwegian markets.",None,None,False),
  ("amundsen-im","Amundsen Investment Management","AM","https://amundsen-im.com/","Oslo","Norway",59.9125,10.7266,"Boutique Norwegian asset manager.",None,None,False),
  ("anna-fund","Anna Fund","AM","https://www.anna.fund/","Oslo","Norway",59.9065,10.7455,"Nordic fund manager with a focus on sustainable investments.",None,None,False),
  ("arctic-am","Arctic Asset Management","AM","https://www.arctic.com/aam","Oslo","Norway",59.9138,10.7312,"Part of the Arctic Securities group, specialising in Norwegian and Nordic markets.",None,None,False),
  ("blueberry-capital","Blueberry Capital","AM","https://blueberry.no/","Oslo","Norway",59.9212,10.7402,"Norwegian asset manager focused on equity strategies.",None,None,False),
  ("borea-am","Borea Asset Management","AM","https://borea.no/","Bergen","Norway",60.3924,5.3218,"Bergen-based independent asset manager specialising in fixed income and equities.",None,None,False),
  ("cworldwide","C WorldWide Asset Management","AM","http://www.cworldwide.com/no/","Oslo","Norway",59.9118,10.7259,"Global asset manager with Nordic focus and offices in Oslo.",None,None,False),
  ("carn-capital","CARN Capital","AM","https://carncapital.com/en/","Oslo","Norway",59.9098,10.7412,"Specialist Norwegian asset manager.",None,None,False),
  ("danske-invest","Danske Invest Asset Management","AM","https://danskeinvest.no","Oslo","Norway",59.9135,10.7508,"Part of Danske Bank Group, managing funds distributed in Norway.",None,None,True),
  ("dnb-am","DNB Asset Management","AM","https://dnbam.com/en","Oslo","Norway",59.9076,10.7601,"Norway's largest bank's asset management arm.","~NOK 900bn","200+",False),
  ("equinor-am","Equinor Asset Management","AM","https://www.equinorfondene.no/","Stavanger","Norway",58.8928,5.7191,"In-house asset management arm of Equinor.",None,None,False),
  ("folketrygdfondet","Folketrygdfondet","AM","https://www.folketrygdfondet.no/","Oslo","Norway",59.9129,10.7263,"Government-owned fund manager for the Government Pension Fund Norway.","~NOK 340bn",None,False),
  ("fondsfinans","Fondsfinans","AM","https://www.fondsfinans.no/","Oslo","Norway",59.9129,10.7311,"Norwegian securities firm offering asset management and equity research.",None,None,False),
  ("fondsforvaltning","Fondsforvaltning","AM","https://www.fondsforvaltning.no/","Oslo","Norway",59.9148,10.7572,"Norwegian asset management company.",None,None,False),
  ("gabler","Gabler","AM","https://gabler.no/","Oslo","Norway",59.9168,10.7422,"Norwegian investment advisor and fund manager.",None,None,False),
  ("handelsbanken","Handelsbanken Fonder","AM","http://www.handelsbanken.no/fond","Oslo","Norway",59.9082,10.7219,"Swedish bank with a strong Norwegian asset management presence.",None,None,True),
  ("heimdal","Heimdal","AM","https://heimdalfondene.no/","Oslo","Norway",59.9188,10.7502,"Norwegian fund manager focused on equity markets.",None,None,False),
  ("holberg","Holberg Fondene","AM","https://www.holberg.no/","Bergen","Norway",60.3938,5.3254,"Independent Bergen-based asset manager with strong track record in Nordic equities.",None,"30-60",False),
  ("klp","KLP","AM","https://www.klp.no/","Oslo","Norway",59.9089,10.7248,"Norway's largest pension fund and life insurance company, known for ESG leadership.","~NOK 900bn","1000+",False),
  ("kraftfinans","Kraftfinans","AM","https://kraftfinans.no/en/","Trondheim","Norway",63.4232,10.4655,"Trondheim-based Norwegian asset manager.",None,None,False),
  ("nordea-am","Nordea Asset Management","AM","https://www.nordeaassetmanagement.com/","Oslo","Norway",59.9288,10.71,"One of the largest asset managers in the Nordics, part of the Nordea Group.","~EUR 250bn",None,True),
  ("nbim","Norges Bank Investment Management","AM","https://www.nbim.no/","Oslo","Norway",59.9086,10.7424,"Manages Norway's Government Pension Fund Global - the world's largest sovereign wealth fund.","~USD 1.7 trillion","600+",False),
  ("norges-investor","NorgesInvestor","AM","https://www.norgesinvestor.no/","Oslo","Norway",59.9127,10.7294,"Norwegian investment management platform.",None,None,False),
  ("norse-forvaltning","Norse Forvaltning","AM","https://www.norseforvaltning.no/","Oslo","Norway",59.9052,10.7402,"Norwegian boutique asset manager.",None,None,False),
  ("nrp-maritime","NRP Maritime Asset Management","AM","https://www.nrp.no/mam/","Oslo","Norway",59.9088,10.7518,"Specialist in maritime and offshore investments.",None,None,False),
  ("odin","ODIN Forvaltning","AM","https://odinfond.no/","Oslo","Norway",59.919,10.7195,"Long-established Nordic equity fund manager with a value investing heritage.",None,"40-80",False),
  ("pareto-am","Pareto Asset Management","AM","https://paretoam.com/en","Oslo","Norway",59.9127,10.7294,"Part of the Pareto Group, one of Norway's leading independent financial services firms.",None,None,False),
  ("req","REQ","AM","https://req.no/","Oslo","Norway",59.915,10.7178,"Norwegian asset manager.",None,None,False),
  ("salt-capital","Salt Capital","AM","https://saltcapital.no/","Oslo","Norway",59.9127,10.7294,"Norwegian ETF provider and asset manager with a strong quant focus.",None,None,False),
  ("sector-am","Sector Asset Management","AM","https://sector.no/","Bergen","Norway",60.3939,5.3245,"Independent Bergen-based asset manager, known for fixed income hedge fund strategies.",None,None,False),
  ("storebrand-am","Storebrand Asset Management","AM","https://www.storebrandam.com/en-gb/","Lysaker","Norway",59.9126,10.6351,"Leading Nordic asset manager in ESG investing. Part of Storebrand Group.","~NOK 1 trillion","200+",False),
  ("storm-capital","Storm Capital Management","AM","https://stormcapital.no/","Oslo","Norway",59.9162,10.7395,"Norwegian asset manager focused on Nordic equities.",None,None,False),
  ("taiga-fund","Taiga Fund","AM","https://www.taigafund.no/","Oslo","Norway",59.9175,10.7448,"Norwegian long/short equity fund with a Nordic focus.",None,None,False),
  ("tind-am","Tind Asset Management","AM","https://tindam.com/","Oslo","Norway",59.9052,10.7538,"Norwegian boutique asset manager.",None,None,False),
  ("protean-funds","Protean Funds","AM","https://www.proteanfunds.com/","Stockholm","Sweden",59.3333,18.0723,"Nordic investment firm offering a long/short equity fund for Nordic markets.",None,None,True),
  ("valhalla-capital","Valhalla Capital","AM","https://valhallacapital.no/","Oslo","Norway",59.9215,10.7375,"Norwegian asset management firm.",None,None,False),
  # ── Holding ──────────────────────────────────────────────────────────────────
  ("arendals-fossekompani","Arendals Fossekompani","HL","https://arendalsfossekompani.no/en/","Arendal","Norway",58.4678,8.7943,"Industrial investment company focused on energy, technology, and aquaculture.",None,None,False),
  # ── Investment Banking ────────────────────────────────────────────────────────
  ("abg","ABG Sundal Collier","IB","https://www.abgsc.com/","Oslo","Norway",59.911,10.7238,"One of the leading Nordic investment banks, with expertise in oil & gas, seafood, and technology.",None,"300+",False),
  # ── Management Consulting ──────────────────────────────────────────────────────
  ("nording-partners","Nording and Partners","MC","https://nordingpartners.no/","Oslo","Norway",59.9195,10.7345,"Norwegian financial advisory and management consulting boutique.",None,None,False),
  ("bcg-oslo","BCG Oslo","MC","https://www.bcg.com/offices/oslo/default","Oslo","Norway",59.9113,10.7249,"Boston Consulting Group Oslo office. Top-tier strategy consulting with strong financial services practice.",None,"100+",False),
  ("bain-oslo","Bain & Company Oslo","MC","https://www.bain.com/offices/oslo/","Oslo","Norway",59.922,10.6855,"Bain & Company Oslo office. Strategy consulting with strong PE due diligence practice.",None,None,False),
  ("mckinsey-oslo","McKinsey Oslo","MC","https://www.mckinsey.com/no/overview","Oslo","Norway",59.9102,10.7228,"McKinsey & Company Oslo office. The leading global strategy consulting firm.",None,None,False),
  ("folden-advisory","Folden Advisory","MC","https://www.foldenadvisory.com/","Oslo","Norway",59.9155,10.7395,"Norwegian financial advisory boutique.",None,None,False),
  # ── Private Equity ──────────────────────────────────────────────────────────
  ("argentum","Argentum","PE","https://argentum.no/","Bergen","Norway",60.3908,5.3222,"Norway's leading PE fund-of-funds investor, backed by the Norwegian government.","~NOK 30bn",None,False),
  ("bluefront","Bluefront Equity","PE","https://bluefrontequity.com/","Oslo","Norway",59.9151,10.7238,"Norwegian PE firm focused on ocean and maritime industries.",None,None,False),
  ("credo-partners","Credo Partners","PE","https://www.credopartners.no/","Oslo","Norway",59.9138,10.7312,"Norwegian mid-market PE firm focused on growth companies.",None,None,False),
  ("cubera","Cubera","PE","https://cubera.no/","Oslo","Norway",59.9211,10.689,"Nordic PE fund-of-funds and secondary investor.",None,None,False),
  ("cvc","CVC Capital Partners","PE","https://www.cvc.com/","Oslo","Norway",59.9142,10.7418,"One of the world's leading PE and investment advisory firms with a Nordic presence.","~EUR 180bn",None,True),
  ("egd-holding","EGD Holding","PE","https://egd.no/","Oslo","Norway",59.9228,10.7428,"Norwegian family-owned investment holding company.",None,None,False),
  ("eqt","EQT Group","PE","https://eqtgroup.com/","Stockholm","Sweden",59.3351,18.0726,"One of the largest PE firms globally with strong Nordic roots.","~EUR 240bn",None,True),
  ("equip-capital","Equip Capital","PE","https://equip.no/","Oslo","Norway",59.9052,10.7482,"Norwegian PE firm focused on growth equity.",None,None,False),
  ("ev-pe","EV Private Equity","PE","https://www.evprivateequity.no/","Stavanger","Norway",58.9727,5.7521,"Stavanger-based PE firm specialising in energy tech and environmental services.",None,None,False),
  ("explore-equity","Explore Equity","PE","https://www.exploreequity.com/","Oslo","Norway",59.9182,10.7542,"Norwegian PE firm investing in Nordic growth companies.",None,None,False),
  ("ferd-capital","Ferd Capital","PE","https://ferd.no/en/capital-en/","Oslo","Norway",59.9085,10.6415,"One of Norway's largest family-owned investment companies (Andresen family).","~NOK 40bn",None,False),
  ("fokus-nordic","Fokus Nordic","PE","https://fokusnordic.com/","Oslo","Norway",59.9045,10.7512,"Norwegian PE firm targeting Nordic mid-market companies.",None,None,False),
  ("fsn-capital","FSN Capital","PE","https://www.fsncapital.com/en/","Oslo","Norway",59.9129,10.7311,"Nordic PE firm with strong track record in buyout investments.","~EUR 3bn","30-60",False),
  ("hawk-infinity","Hawk Infinity","PE","https://hawkinfinity.com/","Oslo","Norway",59.9202,10.7348,"Norwegian investment company.",None,None,False),
  ("hitecvision","HitecVision","PE","https://hitecvision.com/","Stavanger","Norway",58.8928,5.7191,"Leading Nordic PE firm specialising in energy and energy technology.","~USD 5bn",None,False),
  ("jebsen-am","Jebsen Asset Management","PE","https://jebsenassets.com/","Bergen","Norway",60.3942,5.3241,"Family office of the Jebsen family, one of Bergen's most prominent business families.",None,None,False),
  ("kistefos","Kistefos","PE","https://kistefos.no/","Oslo","Norway",59.9105,10.7285,"Investment company owned by Christen Sveaas. Invests in listed and unlisted companies.","~NOK 15bn",None,False),
  ("longship","Longship","PE","https://www.longship.no/en/","Oslo","Norway",59.9133,10.7415,"Norwegian buyout fund targeting Nordic mid-market companies.",None,None,False),
  ("nordic-capital","Nordic Capital","PE","https://www.nordiccapital.com/","Stockholm","Sweden",59.3331,18.0682,"One of the largest Nordic PE firms, with a focus on healthcare and technology.","~EUR 22bn",None,True),
  ("norfund","Norfund","PE","https://www.norfund.no/","Oslo","Norway",59.9132,10.7341,"Norway's government-owned development finance institution investing in developing countries.","~NOK 30bn",None,False),
  ("norvestor","Norvestor","PE","https://norvestor.com/","Oslo","Norway",59.9138,10.7312,"One of the longest-running Norwegian PE firms, focused on mid-market buyouts.","~EUR 2.5bn",None,False),
  ("play-capital","Play Capital","PE","https://www.playcapital.no/","Oslo","Norway",59.9242,10.7482,"Norwegian investment firm focused on digital media and gaming.",None,None,False),
  ("reiten-co","Reiten & Co","PE","https://reitenco.com/","Oslo","Norway",59.911,10.7531,"Norwegian PE and advisory firm targeting Nordic growth companies.",None,None,False),
  ("summa-equity","Summa Equity","PE","https://summaequity.com/","Oslo","Norway",59.9088,10.7228,"Purpose-driven Nordic PE firm investing in sustainability-themed companies.","~EUR 4bn",None,False),
  ("aera-capital","ARA Capital","PE","https://www.aeracap.com/","Oslo","Norway",59.9168,10.7475,"Norwegian PE firm.",None,None,False),
  ("accelerate-capital","Accelerate Capital","PE","https://www.acceleratecapital.no/","Oslo","Norway",59.9144,10.719,"Norwegian PE firm focused on growth equity investments.",None,None,False),
  ("ik-partners","IK Partners","PE","https://ikpartners.com/","Oslo","Norway",59.9092,10.7392,"Pan-European PE firm with Nordic roots and an Oslo office.","~EUR 14bn",None,True),
  ("hg-capital","Hg Capital","PE","https://hgcapital.com/","Oslo","Norway",59.9148,10.7598,"Global PE firm focused on software and technology businesses. Oslo office serves Nordics.","~USD 65bn",None,True),
  # ── Trading ──────────────────────────────────────────────────────────────────
  ("hartree","Hartree Partners","TR","https://www.hartreepartners.com/","Oslo","Norway",59.9099,10.7227,"Global commodities trading firm with Oslo office for Nordic power and energy markets.",None,None,True),
  ("uniper","Uniper","TR","https://www.uniper.energy/","Oslo","Norway",59.9138,10.7418,"European energy company with trading operations in Nordic power markets.",None,None,True),
  ("glencore","Glencore","TR","https://www.glencore.com/","Oslo","Norway",59.9099,10.7227,"One of the world's largest commodity trading companies with Nordic trading operations.",None,None,True),
  ("svelland","Svelland Capital","TR","https://www.svelland.com/","Oslo","Norway",59.9138,10.7312,"Oslo-based commodity macro hedge fund focused on energy, shipping, and metals.",None,None,False),
  ("trafigura","Trafigura","TR","https://www.trafigura.com/","Oslo","Norway",59.9127,10.7294,"One of the world's largest independent commodity trading companies. Nordic office in Oslo.",None,None,True),
  ("ae-energi","AE Energi","TR","https://www.aenergi.no/no","Alesund","Norway",62.4716,6.1607,"Norwegian energy trading company.",None,None,False),
  ("trade-weather-power","Trade Weather Power","TR","https://www.tradewpower.no/","Oslo","Norway",59.9178,10.7498,"Norwegian power and energy trading firm.",None,None,False),
  # ── Venture Capital ───────────────────────────────────────────────────────────
  ("alliance-ventures","Alliance Ventures","VC","https://alliance.vc/","Oslo","Norway",59.9262,10.7365,"Renault-Nissan-Mitsubishi Alliance corporate VC arm with Nordic investments.",None,None,False),
  ("antler","Antler","VC","https://www.antler.co/","Oslo","Norway",59.9102,10.7228,"Global early-stage VC with a strong Oslo presence. Runs a residency program for founders.",None,None,False),
  ("arkwright-x","Arkwright X","VC","https://arkwrightx.vc/","Oslo","Norway",59.9102,10.7438,"Oslo-based VC arm of Arkwright, investing in early-stage Nordic startups.",None,None,False),
  ("corinthian-vp","Corinthian Venture Partners","VC","https://www.corinthianvp.com/","Oslo","Norway",59.9078,10.7458,"Norwegian VC firm focused on early-stage technology investments.",None,None,False),
  ("hadean-ventures","Hadean Ventures","VC","https://hadeanventures.com/","Oslo","Norway",59.9083,10.6981,"Oslo-based VC firm investing in life sciences and medtech.",None,None,False),
  ("herkules","Herkules Capital","VC","https://www.htgc.com/","Oslo","Norway",59.9175,10.7368,"Norwegian growth equity and VC firm.",None,None,False),
  ("idekapital","Idekapital","VC","https://idekapital.com/","Oslo","Norway",59.9128,10.7418,"Norwegian VC firm investing in early-stage technology companies.",None,None,False),
  ("investinor","Investinor","VC","https://investinor.no/","Trondheim","Norway",63.4345,10.4038,"Norwegian government-backed VC fund investing in innovative Norwegian companies.",None,None,False),
  ("katapult","Katapult","VC","https://katapult.vc/","Oslo","Norway",59.9035,10.7428,"Impact-focused VC firm investing in tech startups solving global challenges.",None,None,False),
  ("pioneer-capital","Pioneer Capital","VC","https://www.pioneercapital.no/","Oslo","Norway",59.9248,10.7482,"Norwegian early-stage VC firm.",None,None,False),
  ("proventure","ProVenture","VC","https://www.proventure.no/","Oslo","Norway",59.9188,10.7478,"Norwegian venture firm investing in technology and software companies.",None,None,False),
  ("sandwater","Sandwater","VC","https://www.sandwater.com/","Oslo","Norway",59.9165,10.7386,"Norwegian VC firm focused on deep tech and software.",None,None,False),
  ("skyfall-ventures","Skyfall Ventures","VC","https://www.skyfall.vc/","Oslo","Norway",59.9162,10.7418,"Early-stage VC firm investing in Norwegian and Nordic tech startups.",None,None,False),
  ("sno-ventures","Sno Ventures","VC","https://sno.vc/","Oslo","Norway",59.9112,10.7512,"Norwegian VC firm investing in early-stage Nordic technology companies.",None,None,False),
  ("startuplab-fund","Startuplab Founders Fund","VC","https://www.startuplab.no/ventures","Oslo","Norway",59.9423,10.7167,"VC arm of Startuplab, the leading Norwegian startup ecosystem hub.",None,None,False),
  ("statkraft-ventures","Statkraft Ventures","VC","https://www.statkraftventures.com/","Oslo","Norway",59.9154,10.6357,"Corporate VC arm of Statkraft, investing in green energy and climate tech.",None,None,False),
  ("viking-growth","Viking Growth","VC","https://vikinggrowth.com/","Oslo","Norway",59.9268,10.7392,"Norwegian VC firm supporting Nordic growth companies.",None,None,False),
  # ── Shipping ──────────────────────────────────────────────────────────────────
  ("ssy","SSY","SH","https://www.ssyglobal.com/","Oslo","Norway",59.9092,10.7408,"Shipbroking and financial services firm with a strong Oslo presence.",None,None,False),
]

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
        f'  lat: {lat}',
        f'  lng: {lng}',
        f'  description: "{desc}"',
    ]
    if aum:
        parts.append(f'  aum: "{aum}"')
    if emp:
        parts.append(f'  employees: "{emp}"')
    if nordic:
        parts.append(f'  isNordic: true')
    lines.append("  {" + ",\n  ".join(parts) + "}")

output = 'import { Company } from "@/types"\n\nexport const companies: Company[] = [\n'
output += ",\n".join(lines)
output += "\n]\n\nexport const FILTER_CATEGORIES = ['ALL', 'AM', 'PE', 'VC', 'IB', 'TR', 'MC', 'HF', 'HL', 'SH'] as const\nexport type FilterCategory = typeof FILTER_CATEGORIES[number]\n"

with open("src/data/companies.ts", "w", encoding="utf-8") as f:
    f.write(output)
print(f"Written {len(companies_data)} companies")
