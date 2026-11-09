import React, { useEffect, useState } from "react";

/**
 * Integration contract for the FishLink pond-animation team.
 * Replace ONLY the contents of this component with the actual animation.
 * The My Farms navigation and the rest of FishLink do not need to change.
 */
export type SimulationFarm = {
  id: string;
  name: string;
  location: string;
};

export type SimulationPond = {
  id: string;
  farmId: string;
  name: string;
  population: number;
  length: number;
  width: number;
  status: string;
};

type Language = "en" | "ha" | "yo" | "pcm";

type Props = {
  farms: SimulationFarm[];
  ponds: SimulationPond[];
  language: Language;
};

const copy: Record<Language, Record<string, string>> = {
  en: {},
  ha: {
    "FISHLINK · INTERACTIVE LAB": "FISHLINK · DAKIN GWADA",
    "Live Pond Simulation": "Kwaikwayon Tafki Kai Tsaye",
    "Explore a virtual fish pond and observe its environment. The animated simulation will be connected here by the FishLink simulation team.": "Bincika tafkin kifi na kama-da-wane kuma ka lura da muhallinsa. Ƙungiyar kwaikwayon FishLink za ta haɗa motsin kwaikwayon a nan.",
    "Simulation workspace ready for integration": "Wurin kwaikwayo a shirye don haɗawa",
    "Simulation environment": "Muhallin Kwaikwayo",
    "Select a registered pond to provide context to the simulation.": "Zaɓi tafkin da aka yi rajista domin ba da bayanai ga kwaikwayon.",
    "ANIMATION SLOT": "WURIN MOTSI",
    "Connected FishLink pond": "Tafkin FishLink da aka haɗa",
    "No registered ponds yet. You can still build and test the animation independently; pond data will become available here when a pond is added in My Farms.": "Ba a yi rajistar tafki ba tukuna. Za a iya gina da gwada motsin kwaikwayon daban; bayanan tafki za su bayyana a nan idan an ƙara tafki a Gonakina.",
    "Pond": "Tafki", "Farm": "Gona", "Stock population": "Yawan kifin da aka zuba", "Dimensions": "Girma",
    "fish": "kifi", "Farm not found": "Ba a sami gonar ba",
    "ANIMATION VIEWPORT": "WURIN NUNA MOTSI",
    "Your interactive pond will appear here": "Tafkin hulɗarka zai bayyana a nan",
    "This space is intentionally reserved for the standalone pond animation. No artificial animation or fish-growth calculation is running in this page.": "An tanadi wannan wuri ne domin motsin tafki mai zaman kansa. Babu wani motsi na ƙarya ko lissafin haɓakar kifi da ke gudana a wannan shafin.",
    "Responsive viewport": "Wurin nuni mai daidaitawa", "React / Canvas / Three.js ready": "A shirye don React / Canvas / Three.js", "FishLink pond data available": "Akwai bayanan tafkin FishLink",
    "For the simulation developer": "Ga mai haɓaka kwaikwayon",
    "Build the animation as an independent component and mount it inside": "Gina motsin kwaikwayon a matsayin wani ɓangare mai zaman kansa sannan a saka shi cikin",
    "in this file. Use the selected pond object as the initial data source. See the integration guide included with this project.": "a cikin wannan fayil. Yi amfani da bayanan tafkin da aka zaɓa a matsayin tushen farko. Duba jagorar haɗawa da ke cikin wannan aikin."
  },
  yo: {
    "FISHLINK · INTERACTIVE LAB": "FISHLINK · YÀRÁ ÌṢẸ́ ÌBÁṢẸ̀PỌ̀",
    "Live Pond Simulation": "Àfarawé Adágún Ẹja Lójú Ẹsẹ̀",
    "Explore a virtual fish pond and observe its environment. The animated simulation will be connected here by the FishLink simulation team.": "Ṣàwárí adágún ẹja àfojúrí kí o sì wo àyíká rẹ̀. Ẹgbẹ́ àfarawé FishLink yóò so ìfihàn tó ń rìn mọ́bí.",
    "Simulation workspace ready for integration": "Ibi iṣẹ́ àfarawé ti ṣetán fún ìsopọ̀",
    "Simulation environment": "Àyíká Àfarawé",
    "Select a registered pond to provide context to the simulation.": "Yan adágún tí a forúkọ sílẹ̀ láti pèsè àlàyé fún àfarawé náà.",
    "ANIMATION SLOT": "ÀÀFO ÌFÍHÀN",
    "Connected FishLink pond": "Adágún FishLink tí a so pọ̀",
    "No registered ponds yet. You can still build and test the animation independently; pond data will become available here when a pond is added in My Farms.": "Kò tíì sí adágún tí a forúkọ sílẹ̀. O ṣì lè kọ́ àti dán ìfihàn náà wò lọ́tọ̀; dátà adágún yóò hàn níbí nígbà tí o bá fi adágún kún Àwọn Oko Mi.",
    "Pond": "Adágún", "Farm": "Oko", "Stock population": "Iye ẹja tí a fi sínú adágún", "Dimensions": "Ìwọ̀n",
    "fish": "ẹja", "Farm not found": "A kò rí oko náà",
    "ANIMATION VIEWPORT": "IṢẸ́ ÀFÍHÀN",
    "Your interactive pond will appear here": "Adágún ìbáṣepọ̀ rẹ yóò hàn níbí",
    "This space is intentionally reserved for the standalone pond animation. No artificial animation or fish-growth calculation is running in this page.": "A fi ààyè yìí sílẹ̀ fún ìfihàn adágún tó dá dúró. Kò sí ìfihàn èké tàbí ìṣirò ìdàgbàsókè ẹja tó ń ṣiṣẹ́ lórí ojú-ewé yìí.",
    "Responsive viewport": "Ààyè ìfihàn tó ń bá ẹ̀rọ mu", "React / Canvas / Three.js ready": "Ó ti ṣetán fún React / Canvas / Three.js", "FishLink pond data available": "Dátà adágún FishLink wà nílẹ̀",
    "For the simulation developer": "Fún ẹni tó ń ṣe àfarawé náà",
    "Build the animation as an independent component and mount it inside": "Kọ ìfihàn náà gẹ́gẹ́ bí ẹ̀yà ara tó dá dúró kí o sì so ó mọ́ inú",
    "in this file. Use the selected pond object as the initial data source. See the integration guide included with this project.": "nínú fáìlì yìí. Lo ohun adágún tí a yàn gẹ́gẹ́ bí orísun dátà àkọ́kọ́. Wo ìtọ́sọ́nà ìsopọ̀ tó wà nínú iṣẹ́ yìí."
  },
  pcm: {
    "FISHLINK · INTERACTIVE LAB": "FISHLINK · INTERACTIVE LAB",
    "Live Pond Simulation": "Live Pond Simulation",
    "Explore a virtual fish pond and observe its environment. The animated simulation will be connected here by the FishLink simulation team.": "Explore virtual fish pond and see wetin dey happen inside. FishLink simulation team go connect the animation here.",
    "Simulation workspace ready for integration": "Simulation workspace don ready to connect",
    "Simulation environment": "Simulation environment",
    "Select a registered pond to provide context to the simulation.": "Choose pond wey you don register make the simulation fit use the details.",
    "ANIMATION SLOT": "ANIMATION SLOT",
    "Connected FishLink pond": "FishLink pond wey connect",
    "No registered ponds yet. You can still build and test the animation independently; pond data will become available here when a pond is added in My Farms.": "You never register pond. You fit still build and test the animation separately; pond details go show here when you add pond for My Farms.",
    "Pond": "Pond", "Farm": "Farm", "Stock population": "Fish wey dey inside", "Dimensions": "Size",
    "fish": "fish", "Farm not found": "We no find the farm",
    "ANIMATION VIEWPORT": "ANIMATION VIEWPORT",
    "Your interactive pond will appear here": "Your interactive pond go show here",
    "This space is intentionally reserved for the standalone pond animation. No artificial animation or fish-growth calculation is running in this page.": "We reserve this space for the real pond animation. No fake animation or fish growth calculation dey run for this page.",
    "Responsive viewport": "Responsive viewport", "React / Canvas / Three.js ready": "Ready for React / Canvas / Three.js", "FishLink pond data available": "FishLink pond data dey available",
    "For the simulation developer": "For the simulation developer",
    "Build the animation as an independent component and mount it inside": "Build the animation as independent component and mount am inside",
    "in this file. Use the selected pond object as the initial data source. See the integration guide included with this project.": "for this file. Use the pond wey person select as the first data source. Check the integration guide wey dey inside this project."
  }
};

export default function PondSimulation({ farms, ponds, language }: Props) {
  const [selectedPondId, setSelectedPondId] = useState(ponds[0]?.id ?? "");

  useEffect(() => {
    if (!ponds.some((pond) => pond.id === selectedPondId)) {
      setSelectedPondId(ponds[0]?.id ?? "");
    }
  }, [ponds, selectedPondId]);

  const selectedPond = ponds.find((pond) => pond.id === selectedPondId);
  const selectedFarm = farms.find((farm) => farm.id === selectedPond?.farmId);
  const tr = (value: string) => copy[language][value] ?? value;

  return (
    <div className="pond-sim-page">
      <section className="pond-sim-hero">
        <div className="pond-sim-hero-copy">
          <span className="pond-sim-eyebrow">{tr("FISHLINK · INTERACTIVE LAB")}</span>
          <h2>{tr("Live Pond Simulation")}</h2>
          <p>{tr("Explore a virtual fish pond and observe its environment. The animated simulation will be connected here by the FishLink simulation team.")}</p>
          <div className="pond-sim-status"><span /> {tr("Simulation workspace ready for integration")}</div>
        </div>
        <div className="pond-sim-hero-art" aria-hidden="true">🐟</div>
      </section>

      <section className="pond-sim-context panel">
        <div className="pond-sim-section-heading">
          <div>
            <h3>{tr("Simulation environment")}</h3>
            <p>{tr("Select a registered pond to provide context to the simulation.")}</p>
          </div>
          <span className="pond-sim-tag">{tr("ANIMATION SLOT")}</span>
        </div>

        {ponds.length > 0 ? (
          <div className="pond-sim-select-row">
            <label htmlFor="pond-simulation-select">{tr("Connected FishLink pond")}</label>
            <select
              id="pond-simulation-select"
              value={selectedPondId}
              onChange={(event) => setSelectedPondId(event.target.value)}
            >
              {ponds.map((pond) => (
                <option key={pond.id} value={pond.id}>{pond.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="pond-sim-empty-context">{tr("No registered ponds yet. You can still build and test the animation independently; pond data will become available here when a pond is added in My Farms.")}</div>
        )}

        {selectedPond && (
          <div className="pond-sim-context-grid">
            <div><small>{tr("Pond")}</small><strong>{selectedPond.name}</strong></div>
            <div><small>{tr("Farm")}</small><strong>{selectedFarm?.name ?? tr("Farm not found")}</strong></div>
            <div><small>{tr("Stock population")}</small><strong>{selectedPond.population.toLocaleString()} {tr("fish")}</strong></div>
            <div><small>{tr("Dimensions")}</small><strong>{selectedPond.length} × {selectedPond.width} m</strong></div>
          </div>
        )}
      </section>

      {/*
        FUTURE ANIMATION MOUNT POINT
        The simulation developer can replace this placeholder with their React
        animation component, canvas, Three.js scene, or a secured iframe.
        Props already available above: selectedPond, selectedFarm, farms, ponds.
        Keep the outer .pond-sim-stage container so the page layout remains stable.
      */}
      <section className="pond-sim-stage" id="fishlink-pond-simulation-stage">
        <div className="pond-sim-stage-inner">
          <div className="pond-sim-stage-icon">◉</div>
          <span className="pond-sim-stage-label">{tr("ANIMATION VIEWPORT")}</span>
          <h3>{tr("Your interactive pond will appear here")}</h3>
          <p>{tr("This space is intentionally reserved for the standalone pond animation. No artificial animation or fish-growth calculation is running in this page.")}</p>
          <div className="pond-sim-stage-specs">
            <span>{tr("Responsive viewport")}</span><span>{tr("React / Canvas / Three.js ready")}</span><span>{tr("FishLink pond data available")}</span>
          </div>
        </div>
      </section>

      <section className="pond-sim-integration-note">
        <span>↗</span>
        <div>
          <strong>{tr("For the simulation developer")}</strong>
          <p>
            Build the animation as an independent component and mount it inside
            <code> #fishlink-pond-simulation-stage </code> in this file. Use the
            selected pond object as the initial data source. See the integration
            guide included with this project.
          </p>
        </div>
      </section>
    </div>
  );
}
