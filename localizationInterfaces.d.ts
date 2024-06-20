import { Language } from "~resource/languages"

declare global
{

     interface AbilityLocalization
    {
        ability_classname: string;
        name?: string;
        description?: string;
        scepter_description?: string;
        shard_description?: string;
        lore?: string;
        notes?: Array<string>;
        //reimagined_effects?: Array<ReimaginedEffect>;
        ability_specials?: Array<AbilitySpecialLocalization>;
        language_overrides?: Array<AbilityLocalizationContent>;
    }

     interface AbilityLocalizationContent
    {
        language: Language;
        name_override?: string;
        description_override?: string;
        scepter_description_override?: string;
        shard_description_override?: string;
        lore_override?: string;
        notes_override?: Array<string>;
        //reimagined_effects_override?: Array<ReimaginedEffect>;
        ability_specials_override?: Array<AbilitySpecialLocalization>;
    }

     interface ModifierLocalization
    {
        modifier_classname: string;
        name?: string;
        description?: string;
        language_overrides?: Array<ModifierLocalizationContent>;
    }

     interface ModifierLocalizationContent
    {
        language: Language;
        name_override?: string
        description_override?: string;
    }

     interface StandardLocalization
    {
        classname: string;
        name: string;
        language_overrides?: StandardLocalizationNameOverride[]
    }

     interface StandardLocalizationNameOverride
    {
        language: Language;
        name_override: string
    }

    // export interface ReimaginedEffect
    // {
    //     title: string;
    //     description: string;
    // }

     interface AbilitySpecialLocalization
    {
        ability_special: string;
        text: string;
        percentage?: boolean; // false by default if omitted
        item_stat?: boolean // false by default if omitted
    }

    // export interface HeroTalents
    // {
    //     talent_classname: string;
    //     talents: Array<HeroTalentLocalization>;
    // }

    // export interface HeroTalentLocalization
    // {
    //     name: string;
    //     description: string;
    //     lore: string;
    //     language_overrides?: Array<TalentLocalizationOverrides>
    // }

    // export interface TalentLocalizationOverrides
    // {
    //     language: Language;
    //     name_override?: string;
    //     description_override?: string;
    //     lore_override?: string;
    // }

     interface LocalizationData
    {
        AbilityArray?: Array<AbilityLocalization>;
        ModifierArray?: Array<ModifierLocalization>;
        StandardArray?: Array<StandardLocalization>;
        //TalentArray?: Array<HeroTalents>;
    }

} export {}