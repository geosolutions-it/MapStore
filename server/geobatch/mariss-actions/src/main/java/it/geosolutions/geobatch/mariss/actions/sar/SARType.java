package it.geosolutions.geobatch.mariss.actions.sar;


/**
     * 
     */
    public enum SARType {
        SAR_WIND, SAR_WAVE, SAR_WNF, HIMAGE;

        /**
         * Returns the {@link SARType} associated to the input Type
         * 
         * @param typeName
         */
        public static SARType getType(String typeName) {
            // Allowed values
            SARType[] types = values();
            // Cycle through the various Types
            // searching for a matching name
            for (SARType type : types) {
                if (type.name().contains(typeName.toUpperCase())) {
                    return type;
                }
            }
            // Nothing matches, returning null
            return null;
        }
    }