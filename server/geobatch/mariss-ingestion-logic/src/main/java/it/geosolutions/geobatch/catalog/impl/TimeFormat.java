/*
 *  GeoBatch - Open Source geospatial batch processing system
 *  http://geobatch.geo-solutions.it/
 *  Copyright (C) 2014 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package it.geosolutions.geobatch.catalog.impl;

import it.geosolutions.geobatch.catalog.impl.configuration.TimeFormatConfiguration;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import com.sun.org.apache.xerces.internal.impl.xpath.regex.ParseException;

/**
 * Time format
 * 
 * @author adiaz
 */
public class TimeFormat extends BaseDescriptable {

/**
 * Format configuration for the current time format
 */
private TimeFormatConfiguration timeFormatConfiguration;

/**
 * Compiled patterns
 */
private Map<Integer, List<String>> splittedPatterns;

/**
 * Output formats for the configured patterns 
 */
private List<SimpleDateFormat> outputFormats;

/**
 * UTC timezone to serve as reference
 */
static final TimeZone UTC_TZ = TimeZone.getTimeZone("UTC");

/**
 * Amount of milliseconds in a day.
 */
static final long MILLIS_IN_DAY = 24 * 60 * 60 * 1000;

// Date/ time parameters
private static final int MILLISECONDS_PER_HOUR = 3600000;
private static final int MILLISECONDS_PER_MINUTE = 60000;

/**
 * All patterns that are correct regarding the ISO-8601 norm.
 */
private static final List<String> DEFAULT_PATTERNS;

/**
 * Date format lenient option @see {@link DateFormat#setLenient(boolean)}
 */
private boolean parseLenient = true;

/**
 * Date format time zone option @see {@link DateFormat#setTimeZone(TimeZone)}
 */
private TimeZone parseZone = null;

/**
 * Default option to parse a date. If true the length restriction is not used. 
 * @see TimeFormat#getDate(String, boolean)
 */
private boolean checkAllPatern = true;

/**
 * Default pattern according ISO-8601 standard copied from
 * https://github.com/geotools/geotools/blob/master/modules/plugin/imagemosaic/src/main/java/org/geotools/gce/imagemosaic/properties/time/TimeParser.java?source=cc
 */
static {
    DEFAULT_PATTERNS = new LinkedList<String>();
    
    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HHmmssSSS'Z'");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HH:mm:ss.SSS'Z'");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HHmmssSSS'Z'");
    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HH:mm:ss.SSS");
    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HHmmssSSS");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HH:mm:ss.SSS");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HHmmssSSS");

    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HH:mm:ss'Z'");
    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HHmmss'Z'");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HH:mm:ss'Z'");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HHmmss'Z'");
    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HH:mm:ss");
    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HHmmss");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HH:mm:ss");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HHmmss");

    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HH:mm'Z'");
    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HHmm'Z'");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HH:mm'Z'");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HHmm'Z'");
    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HH:mm");
    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HHmm");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HH:mm");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HHmm");

    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HH'Z'");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HH'Z'");
    DEFAULT_PATTERNS.add("yyyy-MM-dd'T'HH");
    DEFAULT_PATTERNS.add("yyyyMMdd'T'HH");

    DEFAULT_PATTERNS.add("yyyy-MM-dd");
    DEFAULT_PATTERNS.add("yyyyMMdd");

    DEFAULT_PATTERNS.add("yyyy-MM");
    DEFAULT_PATTERNS.add("yyyyMM");

    DEFAULT_PATTERNS.add("yyyy");
    
    // mariss acqlist format
    DEFAULT_PATTERNS.add("dd/MM/yyyy HH:mm:ss");
    
    // mariss CSV product format (type 1_to_3)
    DEFAULT_PATTERNS.add("yyyy-MM-dd HH:mm:ss");

    // mariss CSV product format (type 5)
    DEFAULT_PATTERNS.add("MM/dd/yyyy HH:mm:ss aa");
    
};

/**
 * Generate a time format with the given configuration
 * 
 * @param id
 * @param name
 * @param description
 * @param timeFormatConfiguration if null or not present allowed time formats it uses {@link DEFAULT_PATTERNS}
 */
public TimeFormat(String id, String name, String description,
        TimeFormatConfiguration timeFormatConfiguration) {
    super(id, name, description);
    this.setTimeFormatConfiguration(timeFormatConfiguration);
}

/**
 * @return the timeFormatConfiguration
 */
public TimeFormatConfiguration getTimeFormatConfiguration() {
    return timeFormatConfiguration;
}

/**
 * @param timeFormatConfiguration the timeFormatConfiguration to set
 */
public void setTimeFormatConfiguration(
        TimeFormatConfiguration timeFormatConfiguration) {
    this.timeFormatConfiguration = timeFormatConfiguration;
    initOutputFormats();
    initPatterns();
}


/**
 * Initialize patterns
 */
private void initPatterns() {
    List<String> patterns = this.timeFormatConfiguration != null
            && this.timeFormatConfiguration.getAllowedTimeFormats() != null ? this.timeFormatConfiguration
            .getAllowedTimeFormats() : DEFAULT_PATTERNS;
    Map<Integer, List<String>> tmpPatterns = new HashMap<Integer, List<String>>();

    for (String pattern : patterns) {
        int escapeCount = 0;

        for (char c : pattern.toCharArray()) {
            if (c == '\'')
                escapeCount++;
        }
        int len = pattern.length() - escapeCount;
        List<String> list = tmpPatterns.get(len);
        if (list == null) {
            list = new ArrayList<String>();
            tmpPatterns.put(len, list);
        }
        list.add(pattern);
    }
    splittedPatterns = Collections.unmodifiableMap(tmpPatterns);
}

/**
 * Initalize output formats
 */
private void initOutputFormats() {
    List<String> outputStrings = this.timeFormatConfiguration != null && this.timeFormatConfiguration
            .getAllowedTimeFormats() != null ? this.timeFormatConfiguration
            .getAllowedTimeFormats() : DEFAULT_PATTERNS;
    outputFormats = new LinkedList<SimpleDateFormat>();
    for(String output: outputStrings){
        outputFormats.add(new SimpleDateFormat(output));
    }
}
/**
 * Parses the date given in parameter. The date format should comply to ISO-8601
 * standard. The string may contains either a single date, or a start time, end
 * time and a period. In the first case, this method returns a singleton
 * containing only the parsed date. In the second case, this method returns a
 * list including all dates from start time up to the end time with the interval
 * specified in the {@code value} string.
 * 
 * @param value The date, time and period to parse.
 * @return A list of dates, or an empty list of the {@code value} string is null
 *         or empty.
 * @throws ParseException if the string can not be parsed.
 */
public List<Date> parse(String value) throws ParseException {
    if (value == null) {
        return Collections.emptyList();
    }
    value = value.trim();
    if (value.length() == 0) {
        return Collections.emptyList();
    }
    final List<Date> dates = new ArrayList<Date>();
    if (value.indexOf(',') >= 0) {
        String[] listDates = value.split(",");
        for (int i = 0; i < listDates.length; i++) {
            dates.add(getDate(listDates[i].trim()));
        }
        return dates;
    }
    String[] period = value.split("/");
    // Only one date given.
    if (period.length == 1) {
        if (value.equals("current")) {
            dates.add(Calendar.getInstance(UTC_TZ).getTime());
        } else {
            dates.add(getDate(value));
        }
        return dates;
    }
    // Period like : yyyy-MM-ddTHH:mm:ssZ/yyyy-MM-ddTHH:mm:ssZ/P1D
    if (period.length == 3) {
        final Date begin = getDate(period[0]);
        final Date end = getDate(period[1]);
        final long millisIncrement = parsePeriod(period[2]);
        final long startTime = begin.getTime();
        final long endTime = end.getTime();
        long time;
        int j = 0;
        while ((time = j * millisIncrement + startTime) <= endTime) {
            Calendar calendar = Calendar.getInstance(UTC_TZ);
            calendar.setTimeInMillis(time);
            dates.add(calendar.getTime());
            j++;
        }
        return dates;
    }
    throw new ParseException("Invalid time parameter: " + value, 0);
}

/**
 * Parses date given in parameter according the ISO-8601 standard. This
 * parameter should follow a syntax defined in the {@link #DEFAULT_PATTERNS} array to be
 * validated.
 * 
 * @param value The date to parse.
 * @param checkAll flag to skip the length restriction (allow to parse formats without 0 in a date like '1/1/2014' instead '01/01/2014')
 * @return A date found in the request.
 * @throws ParseException if the string can not be parsed.
 */
public Date getDate(final String value, final boolean checkAll) throws ParseException {
    List<String> suitablePattern = null;
    // checkAll option
    if(!checkAll){
    	suitablePattern = splittedPatterns.get(value.length());
    }
    // if the pattern is not found, try to parse with all patterns
    if (suitablePattern == null) {
        suitablePattern = new LinkedList<String>();
        for (List<String> patterns : splittedPatterns.values()) {
            suitablePattern.addAll(patterns);
        }
    }
    final int size = suitablePattern.size();
    for (int i = 0; i < size; i++) {
        // rebuild formats at each parse, date formats are not thread safe
        final SimpleDateFormat format = new SimpleDateFormat(
                suitablePattern.get(i));
        // parse options
        format.setLenient(parseLenient);
        if(this.parseZone != null){
            format.setTimeZone(parseZone);	
        }

        /*
         * We do not use the standard method DateFormat.parse(String), because
         * if the parsing stops before the end of the string, the remaining
         * characters are just ignored and no exception is thrown. So we have to
         * ensure that the whole string is correct for the format.
         */
        final ParsePosition pos = new ParsePosition(0);
        Date time = format.parse(value, pos);
        if (pos.getIndex() == value.length()) {
            return time;
        }
    }

    // Try to parse as XML Gregorian Calendar
    return getDateXMLGregorianCalendar(value);
}

/**
 * Parses date given in parameter according the ISO-8601 standard. This
 * parameter should follow a syntax defined in the {@link #DEFAULT_PATTERNS} array to be
 * validated.
 * 
 * @param value The date to parse.
 * @return A date found in the request.
 * @throws ParseException if the string can not be parsed.
 */
public Date getDate(final String value) throws ParseException {
    return getDate(value, checkAllPatern);
}

/**
 * Obtain Date from strings like '2014-01-30T08.25.11+01:00' or
 * '2014-01-30T08:25:11+01:00' (uses XMLGregorianCalendar)
 * 
 * @param value
 * @return date
 */
public Date getDateXMLGregorianCalendar(String value) throws ParseException {

    XMLGregorianCalendar gc = null;
    String replaced = value;

    // try to parse dates like '2014-01-30T08.25.11+01:00' as
    // XMLGregorianCalendar format: '2014-01-30T08:25:11+01:00'
    if (value.contains(".")) {
        replaced = value.replaceAll("\\.", "\\:");
    }

    // obtain the date
    try {
        gc = DatatypeFactory.newInstance().newXMLGregorianCalendar(replaced);
        Date date = gc.toGregorianCalendar().getTime();
        return date;
    } catch (Exception e) {
        throw new ParseException("Invalid date: " + value, 0);
    }

}

/**
 * Parses the increment part of a period and returns it in milliseconds.
 * 
 * @param period A string representation of the time increment according the
 *        ISO-8601:1988(E) standard. For example: {@code "P1D"} = one day.
 * @return The increment value converted in milliseconds.
 * @throws ParseException if the string can not be parsed.
 */
public long parsePeriod(final String period) throws ParseException {
    final int length = period.length();
    if (length != 0 && Character.toUpperCase(period.charAt(0)) != 'P') {
        throw new ParseException("Invalid period increment given: " + period, 0);
    }
    long millis = 0;
    boolean time = false;
    int lower = 0;
    while (++lower < length) {
        char letter = Character.toUpperCase(period.charAt(lower));
        if (letter == 'T') {
            time = true;
            if (++lower >= length) {
                break;
            }
        }
        int upper = lower;
        letter = period.charAt(upper);
        while (!Character.isLetter(letter) || letter == 'e' || letter == 'E') {
            if (++upper >= length) {
                throw new ParseException("Missing symbol in \"" + period
                        + "\".", lower);
            }
            letter = period.charAt(upper);
        }
        letter = Character.toUpperCase(letter);
        final double value = Double.parseDouble(period.substring(lower, upper));
        final double factor;
        if (time) {
            switch (letter) {
            case 'S':
                factor = 1000;
                break;
            case 'M':
                factor = 60 * 1000;
                break;
            case 'H':
                factor = 60 * 60 * 1000;
                break;
            default:
                throw new ParseException("Unknown time symbol: " + letter,
                        upper);
            }
        } else {
            switch (letter) {
            case 'D':
                factor = MILLIS_IN_DAY;
                break;
            case 'W':
                factor = 7 * MILLIS_IN_DAY;
                break;
            // TODO: handle months in a better way than just taking the average
            // length.
            case 'M':
                factor = 30 * MILLIS_IN_DAY;
                break;
            case 'Y':
                factor = 365.25 * MILLIS_IN_DAY;
                break;
            default:
                throw new ParseException("Unknown period symbol: " + letter,
                        upper);
            }
        }
        millis += Math.round(value * factor);
        lower = upper;
    }
    return millis;
}

/**
 * Obtain hour offset of the zone
 * 
 * @param cal to obtain it
 * @return hour offset
 */
public int getHour(Calendar cal) {
    return getHour(cal.getTimeZone());
}

/**
 * Obtain minutes offset of the zone
 * 
 * @param cal to obtain it
 * @return minutes offset
 */
public int getMinutes(Calendar cal) {
    return getMinutes(cal.getTimeZone());
}

/**
 * Obtain hour offset of the zone
 * 
 * @param zone to obtain it
 * @return hour offset
 */
public int getHour(TimeZone zone) {
    return (int) Math.floor(zone.getRawOffset() / MILLISECONDS_PER_HOUR);
}

/**
 * Obtain minutes offset of the zone (need to be conbined with
 * {@link TimeUtils#getHour(DateTimeZone)})
 * 
 * @param zone to obtain it
 * @return minutes offset
 */
public int getMinutes(TimeZone zone) {
    return (zone.getRawOffset() - (getHour(zone) * MILLISECONDS_PER_HOUR))
            * MILLISECONDS_PER_MINUTE;
}

/**
 * Check if the time start with the date of today
 * 
 * @param time in a string format starting with a getDayFormatter()
 * @return
 */
public boolean isToday(String time) {
    Calendar cal = getCalendar(time);
    Calendar today = getTodayCalendar();
    if (today.get(Calendar.DATE) == cal.get(Calendar.DATE)) {
        return true;
    } else {
        return false;
    }
}

/**
 * Obtain a time stamp for a input sting with the default format
 * 
 * @param date
 * @return
 */
public Timestamp getTimeStamp(String date) {
    return date != null ? new Timestamp(getDate(date).getTime()) : null;
}

/**
 * @return start time (one day ago)
 */
public Calendar getTodayCalendar() {
    Calendar calendar = new GregorianCalendar();
    int year = calendar.get(Calendar.YEAR);
    int month = calendar.get(Calendar.MONTH);
    int day = calendar.get(Calendar.DATE);
    calendar.set(year, month, day, 0, 0, 0);
    return calendar;
}

/**
 * @return start time (one day ago)
 */
public Date getTodayStart() {
    return getTodayCalendar().getTime();
}

/**
 * @return today 23:59:59 date
 */
public Date getEndOfDay() {
    Calendar calendar = Calendar.getInstance();
    int year = calendar.get(Calendar.YEAR);
    int month = calendar.get(Calendar.MONTH);
    int day = calendar.get(Calendar.DATE);
    calendar.set(year, month, day, 23, 59, 59);
    return calendar.getTime();
}

/**
 * @return start time for today Timestamp
 */
public Timestamp getTodayStartTime() {
    return new Timestamp(getTodayStart().getTime());
}

/**
 * @return start time (one moth ago)
 */
public Date getMonthStart() {
    Calendar calendar = getTodayCalendar();
    calendar.roll(Calendar.MONTH, -1);
    return calendar.getTime();
}

/**
 * @return start time of the day one month ago
 */
public Timestamp getMonthStartTime() {
    return new Timestamp(getMonthStart().getTime());
}

/**
 * @return start time (one year ago)
 */
public Date getYearStart() {
    Calendar calendar = getTodayCalendar();
    calendar.roll(Calendar.YEAR, -1);
    return calendar.getTime();
}

/**
 * @return start time of the day one year ago
 */
public Timestamp getYearStartTime() {
    return new Timestamp(getYearStart().getTime());
}

/**
 * @return today (23:59:59:59)
 */
public Timestamp getTodayEndTime() {
    return new Timestamp(getEndOfDay().getTime());
}

/**
 * @return start time (one week ago)
 */
public Date getWeekStart() {
    Calendar calendar = getTodayCalendar();
    calendar.roll(Calendar.DATE, -7);
    return calendar.getTime();
}

/**
 * @return start time for the day one week ago
 */
public Timestamp getWeekStartTime() {
    return new Timestamp(getWeekStart().getTime());
}

/**
 * Return calendar for a given date
 * 
 * @param date
 * 
 * @return calendar with the date
 */
public Calendar getCalendar(String date) {
    Calendar calendar = new GregorianCalendar();
    calendar.setTime(getDate(date));
    return calendar;
}


/**
 * Return calendar for a given date
 * 
 * @param date
 * 
 * @return calendar with the date
 */
public Calendar getCalendar(Date date) {
    Calendar calendar = new GregorianCalendar();
    calendar.setTime(date);
    return calendar;
}


/**
 * @return now timestamp
 */
public Timestamp getNowTimestamp() {
    return new Timestamp((new Date()).getTime());
}

/**
 * Obtain string format for a given date
 * 
 * @param date
 * @return default output format
 */
public String getDate(Date date) {
    return getDate(date, 0);
}

/**
 * Obtain string format for a given date and specific format
 * 
 * @see initOutputFormats
 * 
 * @param date
 * @param format index to be applied
 * @return String representation for date in the specific format
 */
public String getDate(Date date, int format) {
    return outputFormats.get(format).format(date);
}

/**
 * @return the parseLenient
 */
public boolean isParseLenient() {
	return parseLenient;
}

/**
 * @param parseLenient the parseLenient to set
 */
public void setParseLenient(boolean parseLenient) {
	this.parseLenient = parseLenient;
}

/**
 * @return the parseZone
 */
public TimeZone getParseZone() {
	return parseZone;
}

/**
 * @param parseZone the parseZone to set
 */
public void setParseZone(TimeZone parseZone) {
	this.parseZone = parseZone;
}

/**
 * @return the checkAllPatern
 */
public boolean isCheckAllPatern() {
	return checkAllPatern;
}

/**
 * @param checkAllPatern the checkAllPatern to set
 */
public void setCheckAllPatern(boolean checkAllPatern) {
	this.checkAllPatern = checkAllPatern;
}

}
