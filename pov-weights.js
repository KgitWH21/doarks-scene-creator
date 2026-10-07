// Proposed craft settings, not additional character canon. Each distribution totals 100.
const povProfiles = [
 {weights:[4,3,6,4,3,45,12,5,5,3,1,1,2,3,1,2], reason:'Hudson: dialogue-forward, with room for analysis and firm judgments. His irreverence and specialist outlook guide this proposed mix.'},
 {weights:[3,3,5,3,2,52,9,6,5,3,1,1,1,3,1,2], reason:'Izumi: outgoing, with frequent speech and fragments; navigation and biology also invite observation and reasoning.'},
 {weights:[3,2,4,3,2,55,8,4,4,3,1,1,2,5,1,2], reason:'Cécile: her verbosity and your direction favor spoken exchanges. Longer speech is still a voice choice, not a requirement that she speak every line.'},
 {weights:[7,4,7,5,3,35,13,8,4,3,1,1,1,3,3,2], reason:'Sam: a proposed action-and-observation mix, informed by his nature skill and intensity. This doesn’t establish him as introverted.'},
 {weights:[5,4,6,4,3,40,12,6,4,3,1,1,2,4,2,3], reason:'Ruth: measured dialogue with observation and action. Her restrained humor guides this proposed mix; her chaperone role doesn’t take over the investigation.'}
];
// Ordinary constructions dominate; marked rhetorical patterns remain occasional.
const commonTypeWeights = [16,10,12,2,12,7,4,2,2,4,1,4,5,3,2,4,2,2,3,2,2,2,2,1,1,1,1,1,1,1,1,4,4,3,2,2,3,1,2,2,1,12,2,3];
const povTypeBoosts = [
 {8:2,11:1.5,19:1.5},
 {5:1.5,13:2.5,14:1.5,33:1.3},
 {2:1.6,3:1.8,15:1.6,18:1.4,35:1.5,36:1.4},
 {12:1.7,13:1.5,20:1.6,22:1.4,41:1.5},
 {0:1.3,8:1.5,12:1.4,20:1.4}
];
